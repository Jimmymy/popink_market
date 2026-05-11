#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
ROOT_DIR_WIN="$(pwd -W 2>/dev/null || pwd)"

BASE_URL="${NEXT_PUBLIC_BASE_URL:-http://127.0.0.1:8080}"
DEFAULT_REGION="${NEXT_PUBLIC_DEFAULT_REGION:-jp}"
BACKEND_INTERNAL_URL="${MEDUSA_BACKEND_INTERNAL_URL:-http://127.0.0.1:9000}"
TUNNEL_URL="${POPINK_TUNNEL_URL:-http://127.0.0.1:8080}"

export NEXT_PUBLIC_BASE_URL="$BASE_URL"
export NEXT_PUBLIC_DEFAULT_REGION="$DEFAULT_REGION"
export MEDUSA_BACKEND_INTERNAL_URL="$BACKEND_INTERNAL_URL"
export POPINK_ROOT_DIR_WIN="$ROOT_DIR_WIN"
export POPINK_PROCESS_MATCH="$(basename "$ROOT_DIR")"

PID_DIR="$ROOT_DIR/.tmp"
LOCAL_PID_FILE="$PID_DIR/local-dev.pid"
TUNNEL_PID_FILE="$PID_DIR/cloudflared.pid"
TUNNEL_LOG_FILE="$PID_DIR/cloudflared.log"
TUNNEL_URL_FILE="$PID_DIR/cloudflare-url.txt"

mkdir -p "$PID_DIR"

is_windows_bash() {
  [[ "${OS:-}" == "Windows_NT" ]] || [[ "${MSYSTEM:-}" == MINGW* ]] || [[ "${OSTYPE:-}" == msys* ]]
}

kill_windows_project_processes() {
  if ! command -v powershell.exe >/dev/null 2>&1; then
    return
  fi

  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command '
    $project = $env:POPINK_PROCESS_MATCH
    Get-CimInstance Win32_Process -Filter "name = '\''node.exe'\''" |
      Where-Object { $_.CommandLine -like "*$project*" } |
      ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Get-Process cloudflared -ErrorAction SilentlyContinue |
      Stop-Process -Force -ErrorAction SilentlyContinue
  ' >/dev/null 2>&1 || true
}

kill_pid_file() {
  local file="$1"
  local label="$2"

  if [[ ! -f "$file" ]]; then
    return
  fi

  local pid
  pid="$(cat "$file" 2>/dev/null || true)"

  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    echo "Stopping $label pid=$pid"
    kill "$pid" 2>/dev/null || true
    sleep 2
    if kill -0 "$pid" 2>/dev/null; then
      kill -9 "$pid" 2>/dev/null || true
    fi
  fi

  rm -f "$file"
}

kill_port() {
  local port="$1"

  if is_windows_bash && command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "
      Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique |
        ForEach-Object { Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue }
    " >/dev/null 2>&1 || true
    return
  fi

  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
      echo "Stopping process on port $port: $pids"
      kill $pids 2>/dev/null || true
      sleep 1
      kill -9 $pids 2>/dev/null || true
    fi
    return
  fi

  if command -v fuser >/dev/null 2>&1; then
    if fuser "$port"/tcp >/dev/null 2>&1; then
      echo "Stopping process on port $port"
      fuser -k "$port"/tcp >/dev/null 2>&1 || true
    fi
  fi
}

cleanup() {
  kill_pid_file "$TUNNEL_PID_FILE" "cloudflared tunnel"
  kill_pid_file "$LOCAL_PID_FILE" "local dev services"
}

capture_tunnel_url() {
  local url=""

  for _ in $(seq 1 30); do
    if [[ -f "$TUNNEL_LOG_FILE" ]]; then
      url="$(
        grep -Eo 'https://[A-Za-z0-9-]+\.trycloudflare\.com' "$TUNNEL_LOG_FILE" |
          tail -n 1 || true
      )"
      if [[ -n "$url" ]]; then
        printf '%s\n' "$url" > "$TUNNEL_URL_FILE"
        echo "Cloudflare URL: $url"
        echo "Saved to: $TUNNEL_URL_FILE"
        return 0
      fi

      if grep -qiE 'failed|error|ERR|Internal Server Error' "$TUNNEL_LOG_FILE"; then
        echo "Cloudflare Quick Tunnel did not return a public URL yet."
        echo "Check log: $TUNNEL_LOG_FILE"
        return 1
      fi
    fi

    sleep 1
  done

  echo "Cloudflare URL was not found within 30 seconds."
  echo "Check log: $TUNNEL_LOG_FILE"
  return 1
}

echo "Restarting Popink local staging gateway..."

cleanup
rm -f "$TUNNEL_LOG_FILE" "$TUNNEL_URL_FILE"
if is_windows_bash; then
  kill_windows_project_processes
fi
kill_port 8080
kill_port 8000
kill_port 9000
sleep 2

npm run local:dev &
LOCAL_PID="$!"
echo "$LOCAL_PID" > "$LOCAL_PID_FILE"

echo "Started local dev services pid=$LOCAL_PID"
echo "Waiting for proxy health check..."

for _ in $(seq 1 60); do
  if command -v curl >/dev/null 2>&1 && curl -fsS "http://127.0.0.1:8080/health" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if command -v cloudflared >/dev/null 2>&1; then
  echo "Starting Cloudflare Quick Tunnel for $TUNNEL_URL"
  (cloudflared tunnel --url "$TUNNEL_URL" 2>&1 | tee "$TUNNEL_LOG_FILE" || true) &
  TUNNEL_PID="$!"
  echo "$TUNNEL_PID" > "$TUNNEL_PID_FILE"
  echo "Started cloudflared pid=$TUNNEL_PID"
  capture_tunnel_url || true
else
  echo "cloudflared was not found in this shell. Local gateway is running at http://127.0.0.1:8080"
fi

echo ""
echo "Local gateway: http://127.0.0.1:8080"
echo "Admin:         http://127.0.0.1:8080/app"
echo "Health:        http://127.0.0.1:8080/health"
if [[ -f "$TUNNEL_URL_FILE" ]]; then
  echo "Cloudflare:    $(cat "$TUNNEL_URL_FILE")"
fi
echo ""
echo "Keep this shell open. Press Ctrl+C to stop services started by this script."

trap cleanup INT TERM EXIT
wait "$LOCAL_PID"
