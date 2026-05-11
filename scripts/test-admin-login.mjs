const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:9000"
const EMAIL = process.env.DEMO_ADMIN_EMAIL || "admin@popink.local"
const PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "PopinkAdmin123"

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

async function main() {
  const { token } = await request("/auth/user/emailpass", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  const me = await request("/admin/users/me", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        email: me.user.email,
        user_id: me.user.id,
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
