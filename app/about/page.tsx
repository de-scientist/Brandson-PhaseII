import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Eye, Heart, Users, Award, Zap } from "lucide-react"

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "We never compromise on quality. Every project receives our full attention and the best materials available.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description:
      "Your satisfaction is our priority. We work closely with you to understand and exceed your expectations.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We stay updated with the latest printing technologies and techniques to deliver cutting-edge solutions.",
  },
  {
    icon: Users,
    title: "Reliability",
    description: "Count on us for consistent quality and timely delivery on every single project.",
  },
]

export default function AboutPage() {
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
              About <span className="text-primary">Brandson</span> <span className="text-secondary">Media</span>
            </h1>
            <p className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed">
              Your trusted partner for printing, branding, and signage solutions in Nairobi, Kenya.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Brandson Media was founded with a simple mission: to help businesses in Nairobi and across Kenya
                  create powerful visual identities that stand out in a competitive market.
                </p>
                <p>
                  What started as a small printing operation has grown into a full-service branding and signage company,
                  serving hundreds of satisfied clients including hotels, corporations, institutions, and events.
                </p>
                <p>
                  Today, we pride ourselves on combining traditional craftsmanship with modern printing technology to
                  deliver exceptional results. Our team of skilled professionals is dedicated to bringing your vision to
                  life, whether it is a simple business card or a comprehensive corporate branding project.
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8191234567!2d36.8240932!3d-1.2803867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11f4e8a66603%3A0x73adc5b42c4d867f!2sBrandson%20Media!5e0!3m2!1sen!2ske!4v1704800000000!5m2!1sen!2ske"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Brandson Media Location"
                  className="w-full"
                />
              </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower businesses with high-quality, affordable printing and branding solutions that help them
                communicate their message effectively and build lasting brand recognition.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading printing and branding company in East Africa, known for our creativity, quality, and
                commitment to customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Work With Us?</h2>
          <p className="mt-4 text-lg text-secondary-foreground/90 max-w-2xl mx-auto">
            Let us help you create a powerful visual identity for your brand.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Get in Touch
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent"
              asChild
            >
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
