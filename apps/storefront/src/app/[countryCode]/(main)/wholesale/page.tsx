import StaticInfoPage from "@modules/content/templates/static-info-page"

export default function WholesalePage() {
  return (
    <StaticInfoPage
      eyebrow="Wholesale"
      title="Demo wholesale flow for professional studios"
      intro="The current demo keeps pricing public and checkout simple so reviewers can validate the core order flow before heavier B2B rules are added."
      points={[
        "No customer approval workflow is required in this demo phase.",
        "Wholesale tiers and contract pricing are reserved for later phases.",
        "Demo accounts can register with basic email and password fields.",
        "Admin users can review customers and orders after checkout.",
      ]}
    />
  )
}
