import compareAddresses from "../compare-addresses"

describe("compareAddresses", () => {
  const address = {
    first_name: "Taro",
    last_name: "Yamada",
    address_1: "1-2-3",
    company: "Popink",
    postal_code: "100-0001",
    city: "Tokyo",
    country_code: "jp",
    province: "Tokyo",
    phone: "03-0000-0000",
  }

  it("ignores fields that are not part of the checkout address identity", () => {
    expect(
      compareAddresses(address, {
        ...address,
        metadata: { ignored: true },
      })
    ).toBe(true)
  })

  it("detects a changed shipping address field", () => {
    expect(
      compareAddresses(address, {
        ...address,
        postal_code: "150-0001",
      })
    ).toBe(false)
  })
})
