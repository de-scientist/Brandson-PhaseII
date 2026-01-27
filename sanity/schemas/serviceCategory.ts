import { defineType, defineField } from "sanity"

export const serviceCategory = defineType({
  name: "serviceCategory",
  title: "Service Category",
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
      name: "iconKey",
      type: "string",
      description: "Key for icon mapping in frontend (e.g. 'printing', 'branding')",
    }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
})

