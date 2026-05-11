import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

const getMedusaBackendUrl = () => {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || window.location.origin
    )
  }

  return (
    process.env.MEDUSA_BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://127.0.0.1:9000"
  )
}

export const sdk = new Medusa({
  baseUrl: getMedusaBackendUrl(),
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }
  init = {
    ...init,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
