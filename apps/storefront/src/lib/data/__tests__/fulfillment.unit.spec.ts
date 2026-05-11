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

describe("fulfillment data", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("lists shipping methods for a cart", async () => {
    fetchMock.mockResolvedValue({
      shipping_options: [{ id: "ship_standard" }],
    })

    const { listCartShippingMethods } = await import("../fulfillment")
    const options = await listCartShippingMethods("cart_123")

    expect(fetchMock).toHaveBeenCalledWith("/store/shipping-options", {
      method: "GET",
      query: { cart_id: "cart_123" },
      headers: { authorization: "Bearer test-token" },
      next: { tags: ["fulfillment-cache"] },
      cache: "force-cache",
    })
    expect(options).toEqual([{ id: "ship_standard" }])
  })

  it("calculates shipping option price with cart and custom data", async () => {
    fetchMock.mockResolvedValue({
      shipping_option: { id: "ship_standard", amount: 500 },
    })

    const { calculatePriceForShippingOption } = await import("../fulfillment")
    const option = await calculatePriceForShippingOption(
      "ship_standard",
      "cart_123",
      { postal_code: "100-0001" }
    )

    expect(fetchMock).toHaveBeenCalledWith(
      "/store/shipping-options/ship_standard/calculate",
      {
        method: "POST",
        body: {
          cart_id: "cart_123",
          data: { postal_code: "100-0001" },
        },
        headers: { authorization: "Bearer test-token" },
        next: { tags: ["fulfillment-cache"] },
      }
    )
    expect(option).toEqual({ id: "ship_standard", amount: 500 })
  })

  it("returns null when shipping lookup fails", async () => {
    fetchMock.mockRejectedValue(new Error("network error"))

    const { listCartShippingMethods } = await import("../fulfillment")

    await expect(listCartShippingMethods("cart_123")).resolves.toBeNull()
  })
})
