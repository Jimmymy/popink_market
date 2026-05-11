describe("getBaseURL", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  afterEach(() => {
    jest.resetModules()
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl
    }
  })

  it("uses NEXT_PUBLIC_BASE_URL when configured", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.test"

    const { getBaseURL } = await import("../env")

    expect(getBaseURL()).toBe("https://example.test")
  })

  it("falls back to the local storefront URL", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL

    const { getBaseURL } = await import("../env")

    expect(getBaseURL()).toBe("http://localhost:8000")
  })
})
