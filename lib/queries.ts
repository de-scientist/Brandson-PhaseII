export const homeQuery = `
*[_type == "homePage"][0]{
  title,
  subtitle,
  heroKicker,
  heroBackground,
  heroAnimationStyle,
  primaryCta,
  featuredServices[]->{
    _id,
    name,
    slug,
    shortDescription,
    "image": gallery[0]
  },
  featuredVideos[]->{
    _id,
    title,
    youtubeId,
    youtubeUrl,
    thumbnail,
    description
  },
  seo
}
`

export const servicesWithCategoriesQuery = `
*[_type == "serviceCategory"] | order(order asc) {
  _id,
  title,
  slug,
  iconKey,
  "services": *[_type == "service" && references(^._id)] | order(name asc){
    _id,
    name,
    slug,
    shortDescription,
    pricingTiers,
    ctaLabel,
    ctaType,
    "image": gallery[0]
  }
}
`

export const videosForPlacementQuery = `
*[_type == "video" && $placement in placements[]] | order(order asc) {
  _id,
  title,
  youtubeId,
  youtubeUrl,
  thumbnail,
  description,
  category
}
`

export const pageHeroQuery = `
*[_type == "pageHero" && pageKey == $pageKey][0]{
  pageKey,
  headline,
  subheadline,
  backgroundImage,
  backgroundVideoUrl,
  animationStyle,
  seo
}
`

