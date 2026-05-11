import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const [, , testType, ...jestArgs] = process.argv

if (!testType) {
  console.error("Usage: node scripts/run-backend-jest.mjs <test-type> [...jest-args]")
  process.exit(1)
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const jestBin = path.join(
  rootDir,
  "node_modules",
  "jest",
  "bin",
  "jest.js"
)

const child = spawn(process.execPath, [jestBin, ...jestArgs], {
  cwd: path.join(rootDir, "apps", "backend"),
  env: {
    ...process.env,
    TEST_TYPE: testType,
    NODE_OPTIONS: [
      process.env.NODE_OPTIONS,
      "--experimental-vm-modules",
    ]
      .filter(Boolean)
      .join(" "),
  },
  stdio: "inherit",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  }
  process.exit(code ?? 1)
})
