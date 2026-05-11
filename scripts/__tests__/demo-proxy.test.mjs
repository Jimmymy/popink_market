import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { shouldProxyToBackend } from "../demo-proxy.mjs"

describe("demo proxy routing", () => {
  it("routes backend API and Admin paths to Medusa", () => {
    for (const path of [
      "/store",
      "/store/products",
      "/auth/session",
      "/app/login",
      "/admin/orders",
      "/health",
      "/uploads/file.png",
    ]) {
      assert.equal(shouldProxyToBackend(path), true, path)
    }
  })

  it("routes storefront pages and assets to Next.js", () => {
    for (const path of ["/", "/jp", "/jp/store", "/_next/static/app.js"]) {
      assert.equal(shouldProxyToBackend(path), false, path)
    }
  })

  it("does not route prefix lookalikes to Medusa", () => {
    for (const path of ["/storefront", "/authentication", "/application"]) {
      assert.equal(shouldProxyToBackend(path), false, path)
    }
  })
})
