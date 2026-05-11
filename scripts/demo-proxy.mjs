import http from "node:http"
import { fileURLToPath } from "node:url"

const PROXY_PORT = Number(process.env.DEMO_PROXY_PORT || 8080)
const STOREFRONT_PORT = Number(process.env.STOREFRONT_PORT || 8000)
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 9000)

const backendPrefixes = [
  "/store",
  "/auth",
  "/app",
  "/admin",
  "/health",
  "/uploads",
]

const shouldProxyToBackend = (path = "/") =>
  backendPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

const createProxyServer = () => http.createServer((req, res) => {
  const targetPort = shouldProxyToBackend(req.url) ? BACKEND_PORT : STOREFRONT_PORT
  const originalHost = req.headers.host || `127.0.0.1:${PROXY_PORT}`
  const forwardedProto = req.headers["x-forwarded-proto"] || "http"
  const forwardedFor = req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""

  const proxyReq = http.request(
    {
      hostname: "127.0.0.1",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: originalHost,
        "x-forwarded-host": originalHost,
        "x-forwarded-proto": forwardedProto,
        "x-forwarded-for": forwardedFor,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
      proxyRes.pipe(res)
    }
  )

  proxyReq.on("error", (error) => {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" })
    res.end(`Proxy error: ${error.message}`)
  })

  req.pipe(proxyReq)
})

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]

if (isDirectRun) {
  const server = createProxyServer()
  server.listen(PROXY_PORT, "0.0.0.0", () => {
    console.log(
      `Demo proxy listening on http://0.0.0.0:${PROXY_PORT} -> storefront:${STOREFRONT_PORT}, backend:${BACKEND_PORT}`
    )
  })
}

export { backendPrefixes, shouldProxyToBackend, createProxyServer }
