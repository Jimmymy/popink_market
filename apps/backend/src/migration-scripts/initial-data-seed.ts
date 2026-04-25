import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStoresWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

const demoImage =
  "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png"

export default async function initialDataSeed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  const countries = ["jp"]

  logger.info("Seeding Popink Market store data...")

  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Popink Market Online",
          description: "Default online sales channel for the Japan B2B demo.",
        },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Popink Market Storefront Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Popink Market",
          supported_currencies: [
            {
              currency_code: "jpy",
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  })

  logger.info("Seeding Japan region data...")
  const {
    result: [region],
  } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Japan",
          currency_code: "jpy",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  })

  logger.info("Seeding Japan warehouse and fulfillment data...")
  const {
    result: [stockLocation],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Tokyo Demo Warehouse",
          address: {
            city: "Tokyo",
            country_code: "JP",
            address_1: "Demo warehouse address",
          },
        },
      ],
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  })

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Japan Demo Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Japan",
        geo_zones: [
          {
            country_code: "jp",
            type: "country",
          },
        ],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Japan Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Demo domestic shipping in Japan.",
          code: "jp_standard",
        },
        prices: [
          {
            currency_code: "jpy",
            amount: 800,
          },
          {
            region_id: region.id,
            amount: 800,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  })

  logger.info("Seeding tattoo supply categories and products...")
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Tattoo Consumables",
          handle: "tattoo-consumables",
          is_active: true,
        },
        {
          name: "Tattoo Equipment",
          handle: "tattoo-equipment",
          is_active: true,
        },
        {
          name: "Tattoo Inks",
          handle: "tattoo-inks",
          is_active: true,
        },
        {
          name: "Aftercare",
          handle: "aftercare",
          is_active: true,
        },
      ],
    },
  })

  const categoryId = (name: string) =>
    categories.find((category) => category.name === name)!.id

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Sterile Cartridge Needles Sample Pack",
          subtitle: "Demo consumables",
          category_ids: [categoryId("Tattoo Consumables")],
          description:
            "Sample disposable cartridge needle pack for professional tattoo studio purchasing demos.",
          handle: "sterile-cartridge-needles-sample-pack",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: demoImage }],
          options: [{ title: "Needle Type", values: ["RL", "RS", "M1"] }],
          variants: [
            {
              title: "RL Assortment",
              sku: "PM-NEEDLE-RL-SAMPLE",
              options: { "Needle Type": "RL" },
              prices: [{ amount: 2800, currency_code: "jpy" }],
            },
            {
              title: "RS Assortment",
              sku: "PM-NEEDLE-RS-SAMPLE",
              options: { "Needle Type": "RS" },
              prices: [{ amount: 2800, currency_code: "jpy" }],
            },
            {
              title: "M1 Assortment",
              sku: "PM-NEEDLE-M1-SAMPLE",
              options: { "Needle Type": "M1" },
              prices: [{ amount: 3200, currency_code: "jpy" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Professional Rotary Machine Demo Kit",
          subtitle: "Demo equipment",
          category_ids: [categoryId("Tattoo Equipment")],
          description:
            "Sample rotary machine kit used to validate equipment listings and higher-value B2B product pages.",
          handle: "professional-rotary-machine-demo-kit",
          weight: 900,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: demoImage }],
          options: [{ title: "Voltage", values: ["JP Standard"] }],
          variants: [
            {
              title: "JP Standard",
              sku: "PM-MACHINE-JP-DEMO",
              options: { Voltage: "JP Standard" },
              prices: [{ amount: 42000, currency_code: "jpy" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Black Tattoo Ink 30ml",
          subtitle: "Demo ink",
          category_ids: [categoryId("Tattoo Inks")],
          description:
            "Sample black tattoo ink listing with volume-based product options for the demo catalog.",
          handle: "black-tattoo-ink-30ml",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: demoImage }],
          options: [{ title: "Volume", values: ["30ml", "60ml"] }],
          variants: [
            {
              title: "30ml",
              sku: "PM-INK-BLACK-30",
              options: { Volume: "30ml" },
              prices: [{ amount: 2400, currency_code: "jpy" }],
            },
            {
              title: "60ml",
              sku: "PM-INK-BLACK-60",
              options: { Volume: "60ml" },
              prices: [{ amount: 4200, currency_code: "jpy" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Tattoo Aftercare Balm 50ml",
          subtitle: "Demo aftercare",
          category_ids: [categoryId("Aftercare")],
          description:
            "Sample aftercare balm for validating care product display, pricing, and checkout behavior.",
          handle: "tattoo-aftercare-balm-50ml",
          weight: 160,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: demoImage }],
          options: [{ title: "Size", values: ["50ml"] }],
          variants: [
            {
              title: "50ml",
              sku: "PM-AFTERCARE-BALM-50",
              options: { Size: "50ml" },
              prices: [{ amount: 1800, currency_code: "jpy" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  })

  logger.info("Seeding inventory levels...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 100,
        inventory_item_id: item.id,
      })),
    },
  })

  logger.info("Finished Popink Market demo seed.")
}
