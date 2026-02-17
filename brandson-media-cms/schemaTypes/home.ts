export default {
  name: 'home',
  title: 'Homepage',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Hero Title' },
    { name: 'subtitle', type: 'string', title: 'Hero Subtitle' },
    {
      name: 'images',
      title: 'Hero Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    { name: 'ctaText', type: 'string', title: 'CTA Text' },
    { name: 'ctaLink', type: 'url', title: 'CTA Link' },
  ],
}
