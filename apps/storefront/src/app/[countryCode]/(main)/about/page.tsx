import StaticInfoPage from "@modules/content/templates/static-info-page"

export default function AboutPage() {
  return (
    <StaticInfoPage
      eyebrow="About Popink Market"
      title="Japan-focused tattoo supply commerce demo"
      intro="Popink Market is an early B2B ecommerce demo for professional tattoo studios, artists, and purchasing teams in Japan."
      points={[
        "Built first for local demo validation with Medusa and Next.js.",
        "Catalog examples cover consumables, equipment, inks, and aftercare.",
        "Current sample data is intentionally lightweight and replaceable.",
        "Future phases can add richer product specs, approvals, and integrations.",
      ]}
    />
  )
}
