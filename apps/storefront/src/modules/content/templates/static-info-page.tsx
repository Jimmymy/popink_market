import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"

type StaticInfoPageProps = {
  eyebrow: string
  title: string
  intro: string
  points: string[]
}

export default function StaticInfoPage({
  eyebrow,
  title,
  intro,
  points,
}: StaticInfoPageProps) {
  return (
    <div className="content-container py-12 small:py-20">
      <div className="max-w-3xl">
        <Text className="txt-small-plus text-ui-fg-subtle uppercase">
          {eyebrow}
        </Text>
        <Heading level="h1" className="text-3xl small:text-5xl mt-4">
          {title}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-6">{intro}</Text>
      </div>

      <ul className="grid grid-cols-1 small:grid-cols-2 gap-4 mt-10 max-w-4xl">
        {points.map((point) => (
          <li key={point} className="border border-ui-border-base p-5">
            <Text className="txt-small text-ui-fg-base">{point}</Text>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <LocalizedClientLink
          href="/store"
          className="txt-small-plus text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
        >
          Browse demo catalog
        </LocalizedClientLink>
      </div>
    </div>
  )
}
