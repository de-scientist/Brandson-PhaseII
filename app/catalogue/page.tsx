'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { CatalogueItem } from '@/components/catalogue-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const catalogueItems = [
  {
    id: '1',
    name: 'Business Cards',
    category: 'Paper Printing',
    image: '/placeholder.jpg',
    description: 'Premium business cards printed on high-quality cardstock with custom designs.',
    sizes: '89x51mm',
    finishes: 'Matte, Glossy, Spot UV',
  },
  {
    id: '2',
    name: 'Roll-Up Banners',
    category: 'Banners',
    image: '/professional-roll-up-banner-stand.jpg',
    description: 'Professional roll-up banners for events and exhibitions. Easy to transport and setup.',
    sizes: '80x200cm, 100x200cm',
    finishes: 'Matte Vinyl',
  },
  {
    id: '3',
    name: 'T-Shirt Branding',
    category: 'Apparel',
    image: '/branded-corporate-t-shirts-uniform.jpg',
    description: 'Corporate t-shirts with screen printing and embroidery options for team uniforms.',
    sizes: 'XS to XXXL',
    finishes: 'Screen Print, Embroidery',
  },
  {
    id: '4',
    name: 'UV Printed Water Bottles',
    category: 'UV Printing',
    image: '/uv-printed-branded-water-bottles.jpg',
    description: 'Custom branded water bottles with high-resolution UV printing. Perfect promotional items.',
    sizes: '500ml, 750ml, 1L',
    finishes: 'Full Color UV Print',
  },
  {
    id: '5',
    name: '3D Signage',
    category: 'Signage',
    image: '/3d-company-signage-letters.jpg',
    description: 'Eye-catching 3D signs for restaurants, shops, and businesses. Indoor and outdoor options.',
    sizes: 'Custom Sizes',
    finishes: 'LED, Non-lit',
  },
  {
    id: '6',
    name: 'Vehicle Wrapping',
    category: 'Vehicle Branding',
    image: '/branded-vehicle-car-wrapping.jpg',
    description: 'Full or partial vehicle wraps for mobile advertising and brand visibility.',
    sizes: 'Full Wrap, Half Wrap, Partial',
    finishes: 'Matte, Glossy, Chrome',
  },
  {
    id: '7',
    name: 'Acrylic Menu Holders',
    category: 'Displays',
    image: '/acrylic-menu-holders-displays.jpg',
    description: 'Premium acrylic holders for menus, price tags, and promotional displays.',
    sizes: 'A5, A4, A3',
    finishes: 'Clear, Frosted, Tinted',
  },
  {
    id: '8',
    name: 'Event Backdrops',
    category: 'Event Materials',
    image: '/event-backdrop.jpg',
    description: 'Custom printed backdrops for conferences, weddings, and corporate events.',
    sizes: '2x2m, 3x3m, Custom',
    finishes: 'Fabric, Vinyl',
  },
  {
    id: '9',
    name: 'LED Billboards',
    category: 'Advertising',
    image: '/led-billboard-advertising-nairobi-kenya.jfif',
    description: 'High-resolution LED displays for outdoor advertising with dynamic content.',
    sizes: 'Custom Sizes',
    finishes: 'SMD LED',
  },
  {
    id: '10',
    name: 'Promotional Pens',
    category: 'Promotional Items',
    image: '/branded-pens.jpg',
    description: 'Custom branded pens with UV printing. Affordable and practical giveaways.',
    sizes: 'Standard',
    finishes: 'Full Color Print',
  },
  {
    id: '11',
    name: 'Brochures & Flyers',
    category: 'Paper Printing',
    image: '/placeholder.jpg',
    description: 'Professional brochures and flyers in various sizes and finishes.',
    sizes: 'A4, A5, DL',
    finishes: 'Matte, Glossy, Linen',
  },
  {
    id: '12',
    name: 'Embroidered Caps',
    category: 'Apparel',
    image: '/placeholder.jpg',
    description: 'Quality embroidered caps for corporate uniforms and promotional use.',
    sizes: 'One Size',
    finishes: 'Embroidery, Printing',
  },
];

const categories = ['All', ...new Set(catalogueItems.map((item) => item.category))];

export default function CataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return catalogueItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('/branding-signage.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Our <span className="text-primary">Catalogue</span>
            </h1>
            <p className="text-lg text-dark-section-fg/80 leading-relaxed">
              Browse our complete range of printing, branding, and advertising solutions. Find exactly what you
              need for your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-20 z-10 bg-background border-b border-border py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Grid */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <CatalogueItem key={item.id} {...item} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <p className="text-lg text-muted-foreground">
                No products found matching your search. Try adjusting your filters.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-lg text-secondary-foreground/90 max-w-2xl mx-auto mb-8">
              Can't find exactly what you're looking for? We offer custom solutions tailored to your specific needs.
            </p>
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Contact Us on WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
