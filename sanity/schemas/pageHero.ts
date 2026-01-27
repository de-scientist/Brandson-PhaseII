import { defineType, defineField } from "sanity"

export const pageHero = defineType({
  name: "pageHero",
  title: "Page Hero",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      type: "string",
      description: "e.g. 'services', 'portfolio', 'blog', 'contact'",
      validation: (r) => r.required(),
    }),
    defineField({ name: "headline", type: "string" }),
    defineField({ name: "subheadline", type: "text" }),
    defineField({ name: "backgroundImage", type: "image" }),
    defineField({
      name: "backgroundVideoUrl",
      type: "url",
      description: "Optional background video",
    }),
    defineField({
      name: "animationStyle",
      type: "string",
      options: {
        list: [
          { title: "Kinetic Text", value: "kinetic" },
          { title: "Parallax", value: "parallax" },
          { title: "Minimal Fade", value: "fade" },
        ],
      },
      initialValue: "kinetic",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
})

