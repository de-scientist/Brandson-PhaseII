import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Printer,
  Shirt,
  Sparkles,
  Building2,
  GraduationCap,
  FileText,
  Scissors,
  Layers,
  Package,
  Hotel,
} from "lucide-react"

const serviceCategories = [
  {
    id: "printing",
    icon: Printer,
    title: "Printing & Stickers",
    description: "High-quality banners and stickers for all your promotional needs.",
    items: [
      {
        subtitle: "Banners",
        list: [
          "Roll-up banners",
          "Tear drop banners",
          "Pop-up banners",
          "Backdrop banners",
          "Telescopic banners",
          "Road banners",
        ],
      },
      {
        subtitle: "Stickers",
        list: [
          "Wall branding stickers",
          "Car wrapping & vehicle branding",
          "Packaging labels",
          "Contour cutting stickers",
        ],
      },
    ],
  },
  {
    id: "branding",
    icon: Shirt,
    title: "Branding Services (Apparel)",
    description: "Professional branding on apparel and corporate wear.",
    items: [
      {
        subtitle: "Services",
        list: ["T-shirt branding", "Screen printing", "Embroidery"],
      },
      {
        subtitle: "Branded Items",
        list: ["T-shirts", "Dust coats", "Aprons", "Overalls", "Jackets", "Hoodies", "Caps & hats", "General apparel"],
      },
    ],
  },
  {
    id: "uv-printing",
    icon: Sparkles,
    title: "UV Printing Services",
    description: "Premium UV printing on promotional merchandise and gifts.",
    items: [
      {
        subtitle: "Products",
        list: [
          "Water bottles",
          "Notebooks & diaries",
          "Pens",
          "Thermo mugs & tumblers",
          "Clocks",
          "Desktop organizers",
          "Customized gifts",
          "Promotional merchandise & giveaways",
        ],
      },
    ],
  },
  {
    id: "hotel",
    icon: Hotel,
    title: "Hotel & Conference Solutions",
    description: "Professional branded materials for hospitality and events.",
    items: [
      {
        subtitle: "Products",
        list: ["Branded conference pens", "Notepads & notebooks", "Attendance registers", "Training manuals & guides"],
      },
    ],
  },
  {
    id: "training",
    icon: GraduationCap,
    title: "Training Centres Support",
    description: "Complete solutions for training institutions and workshops.",
    items: [
      {
        subtitle: "Products",
        list: [
          "Training manuals",
          "Custom awards & trophies",
          "Badges & tags",
          "Winner awards",
          "Participant certificates",
        ],
      },
    ],
  },
  {
    id: "paper",
    icon: FileText,
    title: "Paper Printing Services",
    description: "Professional paper printing for corporate documentation.",
    items: [
      {
        subtitle: "Products",
        list: [
          "Company profiles (design & print)",
          "Letterheads",
          "Journals & diaries",
          "Training & conference guides",
        ],
      },
    ],
  },
  {
    id: "laser-cutting",
    icon: Scissors,
    title: "Laser Cutting & Engraving",
    description: "Precision laser cutting and engraving services.",
    items: [
      {
        subtitle: "Services",
        list: [
          "Acrylic / Perspex cutting",
          "2D & 3D logos",
          "Wood cutting & engraving",
          "Wooden key holders",
          "Door signs & hangers",
          "Acrylic room key holders",
          "Floor labels",
          "Building names & signage",
          "Customized engraved items",
        ],
      },
    ],
  },
  {
    id: "signage",
    icon: Building2,
    title: "Signages & 3D Signs",
    description: "Durable indoor and outdoor signage solutions.",
    items: [
      {
        subtitle: "3D Signs For",
        list: ["Restaurants", "Barbershops", "Hotels", "Buildings", "Malls", "Supermarkets", "Gas stations"],
      },
    ],
  },
  {
    id: "displays",
    icon: Layers,
    title: "Acrylic Bending & Custom Displays",
    description: "Custom acrylic displays and holders for retail.",
    items: [
      {
        subtitle: "Products",
        list: [
          "Menu holders",
          "Price tag holders",
          "Promotional stands",
          "Supermarket & electronics displays",
          "Product offer displays",
        ],
      },
    ],
  },
  {
    id: "additional",
    icon: Package,
    title: "Additional Printing Services",
    description: "Comprehensive printing solutions for every need.",
    items: [
      {
        subtitle: "Products",
        list: [
          "Business cards",
          "Wedding cards",
          "Brochures & flyers",
          "Magazines",
          "Eulogies",
          "Desktop standee banners & flags",
          "Institutional & custom flags",
          "Calendars",
          "Event branding",
          "Wheel covers",
          "Event banners & stands",
          "Vehicle branding",
        ],
      },
    ],
  },
]

export default function ServicesPage() {
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
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed">
              Comprehensive printing, branding, and signage solutions tailored to your business needs.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceCategories.map((category) => (
              <Card key={category.id} id={category.id} className="bg-card border-border scroll-mt-24">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-card-foreground">{category.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, idx) => (
                      <div key={idx}>
                        <h4 className="font-medium text-secondary mb-2">{item.subtitle}</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {item.list.map((listItem) => (
                            <li key={listItem} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Need a Custom Solution?</h2>
          <p className="mt-4 text-lg text-secondary-foreground/90 max-w-2xl mx-auto">
            Contact us today to discuss your specific requirements and get a personalized quote.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Get a Quote on WhatsApp
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
