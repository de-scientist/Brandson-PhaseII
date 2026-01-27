import { defineType, defineField } from "sanity"

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "avatar", type: "image" }),
    defineField({ name: "quote", type: "text", validation: (r) => r.required() }),
    defineField({ name: "rating", type: "number", initialValue: 5 }),
    defineField({
      name: "segments",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags like Hotels, Corporates, Events, etc.",
    }),
  ],
})

