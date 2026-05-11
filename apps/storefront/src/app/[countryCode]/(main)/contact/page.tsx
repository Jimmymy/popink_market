import StaticInfoPage from "@modules/content/templates/static-info-page"

export default function ContactPage() {
  return (
    <StaticInfoPage
      eyebrow="Contact"
      title="Demo contact information"
      intro="Contact handling is currently a placeholder. A real email service and operations inbox can be added after the local ecommerce flow is stable."
      points={[
        "Use Medusa Admin for demo product, customer, and order review.",
        "No production email notification service is connected yet.",
        "Support mailbox, phone, and address details are pending confirmation.",
        "Future phases can add SendGrid, Mailgun, Amazon SES, or another provider.",
      ]}
    />
  )
}
