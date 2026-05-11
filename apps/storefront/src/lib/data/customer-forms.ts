export function getCountryCodeFromFormData(formData: FormData) {
  return (formData.get("country_code") as string) || "jp"
}

export function getLoginCredentialsFromFormData(formData: FormData) {
  return {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    countryCode: getCountryCodeFromFormData(formData),
  }
}

export function getSignupPayloadFromFormData(formData: FormData) {
  return {
    password: formData.get("password") as string,
    countryCode: getCountryCodeFromFormData(formData),
    customerForm: {
      email: formData.get("email") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
    },
  }
}
