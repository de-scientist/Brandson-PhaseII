import { defineType, defineField } from "sanity"

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "keywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ogImage", type: "image" }),
  ],
})

