const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'w5a4azh9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN // set this when running if your dataset is protected
})

async function seed() {
  const doc = {
    _id: 'homeDoc',
    _type: 'home',
    title: 'Turning Ideas Into Powerful Visual Brands',
    subtitle: 'Printing • Branding • Signage • Promotional Solutions',
  }

  try {
    const res = await client.createOrReplace(doc)
    console.log('Seeded home doc:', res._id)
  } catch (err) {
    console.error('Seed failed', err)
    process.exit(1)
  }
}

seed()
