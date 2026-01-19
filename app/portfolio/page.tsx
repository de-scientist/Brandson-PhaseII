"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"

const categories = ["All", "Branding", "Printing", "Signage", "UV Printing", "Events"]

const portfolioItems = [
  { title: "Corporate T-Shirt Branding", category: "Branding", image: "/branded-corporate-t-shirts-uniform.jpg" },
  { title: "Roll-Up Banner Design", category: "Printing", image: "/professional-roll-up-banner-stand.jpg" },
  { title: "Vehicle Fleet Branding", category: "Branding", image: "/branded-vehicle-fleet-company-cars.jpg" },
  { title: "Restaurant 3D Signage", category: "Signage", image: "/3d-restaurant-signage-illuminated.jpg" },
  { title: "Branded Water Bottles", category: "UV Printing", image: "/uv-printed-branded-water-bottles.jpg" },
  { title: "Conference Event Setup", category: "Events", image: "/corporate-conference-event-branding.jpg" },
  { title: "Acrylic Menu Holders", category: "Signage", image: "/acrylic-menu-holders.jpg" },
  { title: "Promotional Pens", category: "UV Printing", image: "/branded-pens.jpg" },
  { title: "Corporate Promotional", category: "Printing", image: "/promotional.jpg" },
  { title: "Signs", category: "Signage", image: "/IMG20230907195815.jpg" },
  { title: "Event Backdrop", category: "Events", image: "/event-backdrop.jpg" },
  { title: "Embroidery", category: "Branding", image: "/embroidery.jpg" },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems =
    activeCategory === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
     <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modern-printing-press-industrial.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Our <span className="text-secondary">Portfolio</span>
            </h1>
            <p className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed">
              Explore our recent projects and see the quality of our work.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg bg-card border border-border">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center text-background p-4">
                    <span className="inline-block px-3 py-1 bg-primary rounded-full text-sm font-medium mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center pb-6 md:pb-10">
  <Button
    size="lg"
    className="bg-red-600 text-white hover:bg-red-700 transition-colors"
    asChild
  >
    <a
      href="https://photos.app.goo.gl/62LxMxU1mRU2efhp7"
      target="_blank"
      rel="noopener noreferrer"
    >
      View Full Gallery
    </a>
  </Button>
</div>


      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Like What You See?</h2>
          <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Let us create something amazing for your brand too.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Start Your Project
              </a>
            </Button>
          </div>
          
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
