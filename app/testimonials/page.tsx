import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Wanjiku",
    role: "Marketing Director",
    company: "Savannah Hotels Group",
    image: "/african-woman-professional-headshot.png",
    rating: 5,
    testimonial:
      "Brandson Media transformed our entire hotel branding. From the lobby signage to the room directories, every piece was crafted with exceptional attention to detail. Our guests constantly compliment the premium look and feel. Highly recommended!",
  },
  {
    name: "James Ochieng",
    role: "CEO",
    company: "TechVenture Kenya",
    image: "/african-man-professional-headshot.png",
    rating: 5,
    testimonial:
      "We needed a complete brand overhaul for our tech startup, and Brandson Media delivered beyond expectations. The UV-printed wall graphics in our office look absolutely stunning. Their team understands modern aesthetics perfectly.",
  },
  {
    name: "Grace Mutua",
    role: "Events Coordinator",
    company: "Prestige Events",
    image: "/kenyan-woman-professional-portrait.jpg",
    rating: 5,
    testimonial:
      "For every corporate event we organize, Brandson Media is our go-to partner. Their roll-up banners, backdrops, and promotional materials are always delivered on time and with impeccable quality. They make us look good!",
  },
  {
    name: "David Kimani",
    role: "Branch Manager",
    company: "Unity Bank Kenya",
    image: "/african-businessman-headshot.jpg",
    rating: 5,
    testimonial:
      "The 3D signage Brandson Media created for our new branch is absolutely eye-catching. It has become a landmark in the area. Their professionalism from design to installation was top-notch.",
  },
  {
    name: "Amina Hassan",
    role: "Owner",
    company: "Spice Route Restaurant",
    image: "/african-woman-restaurant-owner.jpg",
    rating: 5,
    testimonial:
      "From our menu designs to the beautiful window graphics, Brandson Media captured the essence of our restaurant perfectly. Our customers love taking photos with our branded elements. True brand partners!",
  },
  {
    name: "Peter Njoroge",
    role: "Operations Director",
    company: "FastTrack Logistics",
    image: "/kenyan-man-corporate-headshot.jpg",
    rating: 5,
    testimonial:
      "Vehicle branding for our entire fleet was a massive project, but Brandson Media handled it seamlessly. Every truck and van looks professional and consistent. It's like having mobile billboards across Nairobi!",
  },
  {
    name: "Catherine Akinyi",
    role: "HR Manager",
    company: "Greenfields Academy",
    image: "/african-woman-educator-professional.jpg",
    rating: 5,
    testimonial:
      "Our school needed complete signage and branding solutions. Brandson Media delivered classroom signs, directional signage, and branded merchandise that our students and staff absolutely love.",
  },
  {
    name: "Michael Mwangi",
    role: "Founder",
    company: "Urban Fitness Studios",
    image: "/african-fitness-trainer-headshot.jpg",
    rating: 5,
    testimonial:
      "The gym wall graphics and motivational quotes Brandson Media designed are incredible. The laser-cut logo at our entrance is a conversation starter for every new member. Exceptional work!",
  },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
       <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modern-printing-press-industrial.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              What Our <span className="text-primary">Clients</span> Say
            </h1>
            <p className="text-lg md:text-xl text-dark-section-fg/80 max-w-3xl mx-auto text-pretty">
              Don't just take our word for it. Hear from businesses across Kenya who have trusted Brandson Media to
              bring their brand visions to life.
            </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground mt-1">Happy Clients</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">1000+</p>
                <p className="text-sm text-muted-foreground mt-1">Projects Completed</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground mt-1">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-primary/20 mb-4" />
                    <p className="text-muted-foreground leading-relaxed mb-6">"{testimonial.testimonial}"</p>
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Happy Clients?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch today for a free consultation.
            </p>
            <a
              href="https://wa.me/254701869821?text=Hello%20Brandson%20Media!%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-background text-primary font-semibold rounded-lg hover:bg-background/90 transition-colors"
            >
              Get Your Free Quote
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
