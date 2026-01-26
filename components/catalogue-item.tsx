'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface CatalogueItemProps {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  sizes?: string;
  finishes?: string;
  index: number;
}

export function CatalogueItem({
  id,
  name,
  category,
  image,
  description,
  sizes,
  finishes,
  index,
}: CatalogueItemProps) {
  const whatsappMessage = `I'm interested in: ${name}. Can you provide more details and a quote?`;
  const whatsappLink = `https://wa.me/254701869821?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative overflow-hidden h-56 bg-muted">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-card-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {sizes && (
          <div className="mb-3">
            <p className="text-xs font-medium text-secondary mb-1">Available Sizes</p>
            <p className="text-xs text-muted-foreground">{sizes}</p>
          </div>
        )}

        {finishes && (
          <div className="mb-4">
            <p className="text-xs font-medium text-secondary mb-1">Available Finishes</p>
            <p className="text-xs text-muted-foreground">{finishes}</p>
          </div>
        )}

        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Request Quote
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
