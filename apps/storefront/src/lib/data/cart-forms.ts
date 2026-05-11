export function getCheckoutAddressPayload(formData: FormData) {
  const shippingAddress = {
    first_name: formData.get("shipping_address.first_name"),
    last_name: formData.get("shipping_address.last_name"),
    address_1: formData.get("shipping_address.address_1"),
    address_2: "",
    company: formData.get("shipping_address.company"),
    postal_code: formData.get("shipping_address.postal_code"),
    city: formData.get("shipping_address.city"),
    country_code: formData.get("shipping_address.country_code"),
    province: formData.get("shipping_address.province"),
    phone: formData.get("shipping_address.phone"),
  }

  const data: Record<string, unknown> = {
    shipping_address: shippingAddress,
    email: formData.get("email"),
  }

  const sameAsBilling = formData.get("same_as_billing")
  if (sameAsBilling === "on") {
    data.billing_address = shippingAddress
  } else {
    data.billing_address = {
      first_name: formData.get("billing_address.first_name"),
      last_name: formData.get("billing_address.last_name"),
      address_1: formData.get("billing_address.address_1"),
      address_2: "",
      company: formData.get("billing_address.company"),
      postal_code: formData.get("billing_address.postal_code"),
      city: formData.get("billing_address.city"),
      country_code: formData.get("billing_address.country_code"),
      province: formData.get("billing_address.province"),
      phone: formData.get("billing_address.phone"),
    }
  }

  return data
}
