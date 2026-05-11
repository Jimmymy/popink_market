import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Popink Market",
  description:
    "Japan-focused B2B tattoo supply commerce demo built with Medusa and Next.js.",
}

const categoryDisplay: Record<string, { label: string; summary: string }> = {
  "tattoo-consumables": {
    label: "消耗品 / Consumables",
    summary: "Needles, cartridges, covers, and studio daily-use supplies.",
  },
  "tattoo-equipment": {
    label: "機材 / Equipment",
    summary: "Machines, power supplies, grips, and professional tools.",
  },
  "tattoo-inks": {
    label: "インク / Inks",
    summary: "Core colors and sample ink catalog for demo ordering.",
  },
  aftercare: {
    label: "アフターケア / Aftercare",
    summary: "Care products for post-session retail and studio use.",
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const [categories, productsResult] = await Promise.all([
    listCategories(),
    listProducts({
      countryCode,
      queryParams: {
        limit: 8,
        order: "-created_at",
      },
    }),
  ])

  const topCategories = categories
    .filter((category) => !category.parent_category)
    .slice(0, 4)
  const products = productsResult.response.products

  return (
    <>
      <Hero />
      <div className="content-container py-12 small:py-20">
        <div className="flex flex-col gap-4 small:flex-row small:items-end small:justify-between mb-8">
          <div>
            <Text className="txt-xlarge">主要カテゴリ / Main categories</Text>
            <Text className="txt-small text-ui-fg-subtle mt-2">
              Demo catalog structure for Japan-based professional tattoo studios.
            </Text>
          </div>
          <LocalizedClientLink
            href="/store"
            className="txt-small-plus text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
          >
            View all products
          </LocalizedClientLink>
        </div>

        <ul className="grid grid-cols-1 small:grid-cols-2 gap-4">
          {topCategories.map((category) => {
            const display = categoryDisplay[category.handle] || {
              label: category.name,
              summary: "Browse Popink Market demo products in this category.",
            }

            return (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="block border border-ui-border-base p-6 hover:bg-ui-bg-subtle transition-colors"
                >
                  <Text className="txt-large">{display.label}</Text>
                  <Text className="txt-small text-ui-fg-subtle mt-2">
                    {display.summary}
                  </Text>
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="content-container pb-16 small:pb-24">
        <div className="flex flex-col gap-4 small:flex-row small:items-end small:justify-between mb-8">
          <div>
            <Text className="txt-xlarge">新着サンプル / Latest demo products</Text>
            <Text className="txt-small text-ui-fg-subtle mt-2">
              Public JPY pricing remains visible for the current demo phase.
            </Text>
          </div>
        </div>

        <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
