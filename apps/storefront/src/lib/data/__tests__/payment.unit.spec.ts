const fetchMock = jest.fn()

jest.mock("@lib/config", () => ({
  sdk: {
    client: {
      fetch: fetchMock,
    },
  },
}))

jest.mock("../cookies", () => ({
  getAuthHeaders: jest.fn(async () => ({ authorization: "Bearer test-token" })),
  getCacheOptions: jest.fn(async (tag: string) => ({ tags: [`${tag}-cache`] })),
}))

describe("payment data", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("lists payment providers for a region sorted by id", async () => {
    fetchMock.mockResolvedValue({
      payment_providers: [{ id: "stripe" }, { id: "manual" }],
    })

    const { listCartPaymentMethods } = await import("../payment")
    const providers = await listCartPaymentMethods("reg_jp")

    expect(fetchMock).toHaveBeenCalledWith("/store/payment-providers", {
      method: "GET",
      query: { region_id: "reg_jp" },
      headers: { authorization: "Bearer test-token" },
      next: { tags: ["payment_providers-cache"] },
      cache: "force-cache",
    })
    expect(providers?.map((provider) => provider.id)).toEqual([
      "manual",
      "stripe",
    ])
  })

  it("returns null when payment provider lookup fails", async () => {
    fetchMock.mockRejectedValue(new Error("network error"))

    const { listCartPaymentMethods } = await import("../payment")

    await expect(listCartPaymentMethods("reg_jp")).resolves.toBeNull()
  })
})
