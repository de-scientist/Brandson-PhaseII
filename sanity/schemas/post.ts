import { defineType, defineField } from "sanity"

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "content", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "featuredImage", type: "image" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "readTime", type: "number" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
})

