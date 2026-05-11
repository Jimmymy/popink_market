param(
  [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
  [string[]]$Paths
)

[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

foreach ($path in $Paths) {
  if (-not (Test-Path -LiteralPath $path)) {
    Write-Error "Path not found: $path"
    continue
  }

  Write-Host "===== $path ====="
  Get-Content -LiteralPath $path -Encoding UTF8
  Write-Host ""
}
