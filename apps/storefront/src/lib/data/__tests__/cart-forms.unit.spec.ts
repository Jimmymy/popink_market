import { getCheckoutAddressPayload } from "../cart-forms"

const baseCheckoutForm = () => {
  const formData = new FormData()
  formData.set("email", "buyer@example.com")
  formData.set("shipping_address.first_name", "Taro")
  formData.set("shipping_address.last_name", "Yamada")
  formData.set("shipping_address.address_1", "1-2-3")
  formData.set("shipping_address.company", "Popink")
  formData.set("shipping_address.postal_code", "100-0001")
  formData.set("shipping_address.city", "Tokyo")
  formData.set("shipping_address.country_code", "jp")
  formData.set("shipping_address.province", "Tokyo")
  formData.set("shipping_address.phone", "03-0000-0000")
  return formData
}

describe("checkout address form parsing", () => {
  it("uses the shipping address as billing address when requested", () => {
    const formData = baseCheckoutForm()
    formData.set("same_as_billing", "on")

    const payload = getCheckoutAddressPayload(formData)

    expect(payload.billing_address).toBe(payload.shipping_address)
    expect(payload).toMatchObject({
      email: "buyer@example.com",
      shipping_address: {
        first_name: "Taro",
        country_code: "jp",
      },
    })
  })

  it("extracts a separate billing address", () => {
    const formData = baseCheckoutForm()
    formData.set("billing_address.first_name", "Hanako")
    formData.set("billing_address.last_name", "Suzuki")
    formData.set("billing_address.address_1", "4-5-6")
    formData.set("billing_address.company", "Ink Studio")
    formData.set("billing_address.postal_code", "150-0001")
    formData.set("billing_address.city", "Shibuya")
    formData.set("billing_address.country_code", "jp")
    formData.set("billing_address.province", "Tokyo")
    formData.set("billing_address.phone", "03-1111-1111")

    expect(getCheckoutAddressPayload(formData)).toMatchObject({
      billing_address: {
        first_name: "Hanako",
        postal_code: "150-0001",
      },
    })
  })
})
