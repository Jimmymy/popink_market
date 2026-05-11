import {
  getCountryCodeFromFormData,
  getLoginCredentialsFromFormData,
  getSignupPayloadFromFormData,
} from "../customer-forms"

describe("customer form parsing", () => {
  it("defaults account actions to the Japan country code", () => {
    const formData = new FormData()

    expect(getCountryCodeFromFormData(formData)).toBe("jp")
  })

  it("extracts login credentials and country code", () => {
    const formData = new FormData()
    formData.set("email", "buyer@example.com")
    formData.set("password", "secret")
    formData.set("country_code", "jp")

    expect(getLoginCredentialsFromFormData(formData)).toEqual({
      email: "buyer@example.com",
      password: "secret",
      countryCode: "jp",
    })
  })

  it("extracts signup customer fields", () => {
    const formData = new FormData()
    formData.set("email", "buyer@example.com")
    formData.set("password", "secret")
    formData.set("first_name", "Taro")
    formData.set("last_name", "Yamada")
    formData.set("phone", "03-0000-0000")

    expect(getSignupPayloadFromFormData(formData)).toEqual({
      password: "secret",
      countryCode: "jp",
      customerForm: {
        email: "buyer@example.com",
        first_name: "Taro",
        last_name: "Yamada",
        phone: "03-0000-0000",
      },
    })
  })
})
