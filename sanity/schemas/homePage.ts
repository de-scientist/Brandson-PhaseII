import { defineType, defineField } from "sanity"

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "subtitle", type: "string" }),
    defineField({ name: "heroKicker", type: "string" }),
    defineField({
      name: "heroBackground",
      type: "image",
    }),
    defineField({
      name: "heroAnimationStyle",
      type: "string",
      options: {
        list: [
          { title: "Morph", value: "morph" },
          { title: "Clip Path", value: "clip" },
          { title: "Blur → Focus", value: "blurFocus" },
        ],
      },
      initialValue: "blurFocus",
    }),
    defineField({
      name: "primaryCta",
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "href", type: "string" },
      ],
    }),
    defineField({
      name: "featuredServices",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "featuredVideos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "video" }] }],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
})

