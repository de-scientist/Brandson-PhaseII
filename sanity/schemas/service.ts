import { defineType, defineField } from "sanity"

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "serviceCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", type: "text" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "pricingTiers",
      title: "Pricing Tiers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "price", type: "number" },
            { name: "currency", type: "string", initialValue: "KES" },
            { name: "description", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "ctaLabel",
      type: "string",
      initialValue: "Request Quote",
    }),
    defineField({
      name: "ctaType",
      type: "string",
      options: {
        list: [
          { title: "Request Quote", value: "quote" },
          { title: "Pay Now", value: "pay" },
        ],
      },
      initialValue: "quote",
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "seo", type: "seo" }),
  ],
})

