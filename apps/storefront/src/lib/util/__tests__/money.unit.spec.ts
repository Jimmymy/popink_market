import { convertToLocale } from "../money"

describe("convertToLocale", () => {
  it("formats an amount with a currency code", () => {
    expect(
      convertToLocale({
        amount: 1200,
        currency_code: "JPY",
        locale: "ja-JP",
      })
    ).toBe("￥1,200")
  })

  it("returns the numeric string when currency code is empty", () => {
    expect(
      convertToLocale({
        amount: 1200,
        currency_code: "",
      })
    ).toBe("1200")
  })
})
