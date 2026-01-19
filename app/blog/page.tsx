import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, MessageCircle } from "lucide-react"
import { blogPosts, blogCategories } from "@/lib/blog-data"
import { BlogFilters } from "@/components/blog-filters"

export const metadata: Metadata = {
  title: "Blog & Insights | Printing, Branding & Signage in Nairobi",
  description:
    "Expert tips on printing, branding, signage, UV printing & promotional materials in Nairobi, Kenya. Trusted insights from Brandson Media for your business.",
  keywords:
    "printing Nairobi, branding Kenya, signage Nairobi, UV printing Kenya, promotional products Nairobi, Brandson Media blog",
  openGraph: {
    title: "Blog & Insights | Printing, Branding & Signage in Nairobi",
    description:
      "Expert tips on printing, branding, signage, UV printing & promotional materials in Nairobi, Kenya. Trusted insights from Brandson Media.",
    type: "website",
    locale: "en_KE",
    siteName: "Brandson Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Insights | Brandson Media Nairobi",
    description: "Expert printing, branding & signage tips for Kenyan businesses.",
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
       <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modern-printing-press-industrial.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              Blog & <span className="text-primary">Insights</span>
            </h1>
            <p className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed">
              Expert tips and insights on printing, branding, and signage solutions in Nairobi, Kenya. Stay updated with
              the latest trends in promotional materials and UV printing services.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <BlogFilters categories={blogCategories} />

          {/* Blog Grid */}
          <article className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-card border-border overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{post.category}</Badge>
                  </div>
                </Link>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime} min read
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="mt-3 text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </article>

          {/* Internal Links to Services */}
          <nav className="mt-16 p-8 bg-muted rounded-xl" aria-label="Related Services">
            <h2 className="text-2xl font-bold text-foreground mb-4">Explore Our Services</h2>
            <p className="text-muted-foreground mb-6">
              Looking for professional printing and branding services in Nairobi? Check out what Brandson Media offers:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/services#printing">
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Banner Printing
                </Badge>
              </Link>
              <Link href="/services#branding">
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Corporate Branding
                </Badge>
              </Link>
              <Link href="/services#signage">
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  3D Signage
                </Badge>
              </Link>
              <Link href="/services#uv-printing">
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  UV Printing
                </Badge>
              </Link>
              <Link href="/services#laser-cutting">
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Laser Cutting
                </Badge>
              </Link>
            </div>
          </nav>
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Need Professional Printing or Branding?</h2>
          <p className="mt-4 text-lg text-secondary-foreground/90 max-w-2xl mx-auto">
            Chat with us on WhatsApp for quick quotes and expert advice on all your printing, branding, and signage
            needs in Nairobi, Kenya.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp
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
