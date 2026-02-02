import { defineType, defineField } from "sanity"

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "youtubeUrl",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "youtubeId",
      type: "string",
      description: "Auto-extracted; fallback field if parsing fails",
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      description: "Custom thumbnail (optional, falls back to YouTube)",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Printing Process", "Branding", "Client Work", "Reels", "Brand Story"],
      },
    }),
    defineField({
      name: "placements",
      title: "Placement",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Homepage", value: "homepage" },
          { title: "Services", value: "services" },
          { title: "Portfolio", value: "portfolio" },
          { title: "Blog", value: "blog" },
        ],
      },
    }),
    defineField({
      name: "order",
      type: "number",
    }),
  ],
  orderings: [{ title: "Order Asc", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
})

