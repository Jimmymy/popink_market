import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL("../", import.meta.url))
const npmCmd = process.platform === "win32" ? "cmd.exe" : "npm"
const npmArgs = (args) =>
  process.platform === "win32" ? ["/d", "/s", "/c", "npm", ...args] : args

const sanitizeEnv = (env) =>
  Object.fromEntries(
    Object.entries(env).filter(
      ([key, value]) =>
        value !== undefined &&
        key.length > 0 &&
        !key.startsWith("=") &&
        !key.includes("\0")
    )
  )

const sharedEnv = {
  ...process.env,
  NEXT_PUBLIC_BASE_URL:
    process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8080",
  NEXT_PUBLIC_DEFAULT_REGION:
    process.env.NEXT_PUBLIC_DEFAULT_REGION || "jp",
  MEDUSA_BACKEND_INTERNAL_URL:
    process.env.MEDUSA_BACKEND_INTERNAL_URL || "http://127.0.0.1:9000",
}

const backendCors = [
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]

const commands = [
  {
    name: "db",
    args: ["run", "db:up"],
    env: sharedEnv,
  },
  {
    name: "backend",
    args: ["run", "backend:dev"],
    env: {
      ...sharedEnv,
      HOST: process.env.HOST || "0.0.0.0",
      PORT: process.env.BACKEND_PORT || "9000",
      STORE_CORS: process.env.STORE_CORS || backendCors.join(","),
      ADMIN_CORS:
        process.env.ADMIN_CORS ||
        [...backendCors, "http://localhost:9000", "http://127.0.0.1:9000"].join(
          ","
        ),
      AUTH_CORS:
        process.env.AUTH_CORS ||
        [
          ...backendCors,
          "http://localhost:9000",
          "http://127.0.0.1:9000",
        ].join(","),
    },
  },
  {
    name: "storefront",
    args: ["run", "storefront:dev"],
    env: sharedEnv,
  },
  {
    name: "proxy",
    args: ["run", "demo:proxy"],
    env: {
      ...sharedEnv,
      DEMO_PROXY_PORT: process.env.DEMO_PROXY_PORT || "8080",
      STOREFRONT_PORT: process.env.STOREFRONT_PORT || "8000",
      BACKEND_PORT: process.env.BACKEND_PORT || "9000",
    },
  },
]

const children = []

const run = ({ name, args, env }) =>
  new Promise((resolve, reject) => {
    const child = spawn(npmCmd, npmArgs(args), {
      cwd: rootDir,
      env: sanitizeEnv(env),
      stdio: "inherit",
      shell: false,
    })

    child.once("spawn", () => {
      children.push(child)
      resolve(child)
    })

    child.once("error", reject)
  })

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM")
    }
  }
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

await run(commands[0])

for (const command of commands.slice(1)) {
  await run(command)
}

console.log("")
console.log("Local demo is starting.")
console.log("Storefront and backend share one LAN entry via http://127.0.0.1:8080")
console.log("Open http://<your-local-ip>:8080 from another device on the same network.")

await new Promise((resolve, reject) => {
  let settled = false

  for (const child of children.slice(1)) {
    child.once("exit", (code) => {
      if (!settled) {
        settled = true
        shutdown()
        if (code && code !== 0) {
          reject(new Error(`Process exited with code ${code}`))
          return
        }
        resolve()
      }
    })
  }
})
