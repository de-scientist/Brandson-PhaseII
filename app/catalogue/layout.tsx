import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Catalogue | Brandson Media',
  description: 'Browse our complete catalogue of printing, branding, UV printing, signage, and promotional products. Request quotes for business cards, banners, t-shirts, vehicle wraps, and more.',
  keywords: ['product catalogue', 'printing products', 'branding items', 'promotional merchandise', 'signage products'],
  openGraph: {
    title: 'Brandson Media Product Catalogue',
    description: 'Explore our full range of professional printing and branding solutions',
    type: 'website',
  },
};

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
