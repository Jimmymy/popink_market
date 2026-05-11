const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  "pk_5e6096e8abfbf3a3e03932398f3d26ecb039ed1565d7b7b85d42e11951b62bcc"
const EMAIL = process.env.DEMO_CUSTOMER_EMAIL || "demo@popink.local"
const PASSWORD = process.env.DEMO_CUSTOMER_PASSWORD || "PopinkDemo123"

async function request(path, init = {}) {
  const response = await fetch(`${BACKEND_URL}${path}`, init)
  const text = await response.text()

  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    throw new Error(
      `${init.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(data)}`
    )
  }

  return data
}

async function ensureCustomerAccount() {
  const { token } = await request("/auth/customer/emailpass", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  try {
    const customerRes = await request("/store/customers/me", {
      headers: {
        authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
    })

    return { token, customer: customerRes.customer }
  } catch {
    const createRes = await request("/store/customers", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        email: EMAIL,
        first_name: "Demo",
        last_name: "User",
      }),
    })

    return { token, customer: createRes.customer }
  }
}

async function main() {
  const { token, customer } = await ensureCustomerAccount()

  const me = await request("/store/customers/me", {
    headers: {
      authorization: `Bearer ${token}`,
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        email: customer.email,
        customer_id: customer.id,
        me_id: me.customer.id,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
