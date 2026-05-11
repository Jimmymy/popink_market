import StaticInfoPage from "@modules/content/templates/static-info-page"

export default function ShippingPage() {
  return (
    <StaticInfoPage
      eyebrow="Shipping"
      title="Manual shipping placeholder for demo orders"
      intro="Popink Market currently uses demo shipping options. Real carrier integration is intentionally deferred until the basic storefront and order loop are validated."
      points={[
        "Checkout records shipping details for each demo order.",
        "No real Yamato, Sagawa, or Japan Post integration is active.",
        "Shipping method names and prices can be adjusted in Medusa Admin.",
        "Future phases can evaluate local carrier and fulfillment workflows.",
      ]}
    />
  )
}
