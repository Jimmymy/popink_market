import StaticInfoPage from "@modules/content/templates/static-info-page"

export default function ReturnsPage() {
  return (
    <StaticInfoPage
      eyebrow="Returns"
      title="Returns policy placeholder"
      intro="This page is a demo placeholder for review conversations. Final return and exchange rules should be confirmed with the business owner before production use."
      points={[
        "Demo orders do not trigger real return operations.",
        "Consumable and sterile product rules need business confirmation.",
        "Admin order records remain available for manual review.",
        "Production policy text should be finalized before public launch.",
      ]}
    />
  )
}
