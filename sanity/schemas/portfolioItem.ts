import { defineType, defineField } from "sanity"

export const portfolioItem = defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "service",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Branding", "Printing", "Signage", "UV Printing", "Events"],
      },
    }),
    defineField({ name: "summary", type: "text" }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({ name: "completedAt", type: "datetime" }),
    defineField({ name: "seo", type: "seo" }),
  ],
})

