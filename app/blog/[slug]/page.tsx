import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  MessageCircle, 
  Share2, 
  ChevronRight 
} from "lucide-react"
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blog-data"

type Props = {
  params: Promise<{ slug: string }>
}

// ... generateMetadata and generateStaticParams remain the same ...

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  const relatedPosts = getRelatedPosts(slug, post.category)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Progress Bar (Client component ideally, but can be simulated or added via CSS) */}
      <div className="fixed top-0 left-0 z-50 h-1 bg-primary w-0 transition-all duration-150" id="scroll-progress" />

      <main>
        {/* Header/Hero Section */}
        <div className="relative pt-12 pb-16 lg:pt-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Insights
            </Link>
            
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-1 text-sm font-medium uppercase tracking-wider">
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-medium text-foreground">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-KE", {
                  month: "long", day: "numeric", year: "numeric"
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image - Wide/Cinematic */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl shadow-2xl">
            <Image 
              src={post.featuredImage || "/placeholder.svg"} 
              alt={post.title} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>
        </div>

        {/* Article Content Layout */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Left Sidebar: Share & Author (Desktop Only) */}
            <aside className="hidden lg:block w-16 sticky top-24 self-start">
              <div className="flex flex-col gap-4 items-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground rotate-180 [writing-mode:vertical-lr]">Share</span>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                  <Share2 className="h-4 w-4" />
                </Button>
                <div className="h-12 w-[1px] bg-border my-2" />
              </div>
            </aside>

            {/* Main Article Body */}
          
  <article className="flex-1 max-w-3xl mx-auto">
  <div
    className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none
      prose-headings:text-foreground 
      prose-headings:font-bold 
      prose-headings:tracking-tight
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-2
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
      prose-p:text-muted-foreground/90 
      prose-p:leading-relaxed 
      prose-p:mb-6
      prose-strong:text-foreground 
      prose-strong:font-bold 
      prose-strong:bg-primary/5 
      prose-strong:px-1 
      prose-strong:rounded
      prose-li:text-muted-foreground 
      prose-ul:list-disc prose-ul:pl-6
      prose-ol:list-decimal prose-ol:pl-6
      prose-blockquote:border-l-primary 
      prose-blockquote:bg-muted/30 
      prose-blockquote:py-2 
      prose-blockquote:pr-4 
      prose-blockquote:rounded-r-lg
      prose-blockquote:italic
      prose-img:rounded-2xl 
      prose-img:shadow-xl
      prose-a:text-primary 
      prose-a:font-semibold 
      prose-a:no-underline 
      hover:prose-a:underline 
      hover:prose-a:text-primary/80"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {post.content}
    </ReactMarkdown>
  </div>

              {/* Author Bio Section */}
              <div className="mt-16 p-8 rounded-3xl bg-muted/50 border border-border flex flex-col sm:flex-row gap-6 items-center">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold">About {post.author.name}</h4>
                  <p className="text-muted-foreground mt-1">
                    Expert in {post.category} and brand strategy at Brandson Media, helping businesses in Nairobi stand out through quality design.
                  </p>
                </div>
              </div>
            </article>

            {/* Right Sidebar: Sticky CTA */}
            <aside className="lg:w-80 sticky top-24 self-start">
              <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Ready to transform your brand?</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Get custom {post.category.toLowerCase()} solutions tailored for your business needs.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-primary hover:bg-primary/90 shadow-md group" asChild>
                      <a href="https://wa.me/254701869821" target="_blank">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Free Consultation
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/services">View Portfolio</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      {/* Related Posts: Refined Grid */}
      {relatedPosts.length > 0 && (
        <section className="py-24 mt-16 bg-muted/30 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Keep Reading</h2>
                <p className="text-muted-foreground mt-2">More insights on {post.category}</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/blog">View all posts</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <div className="relative h-64 mb-4 overflow-hidden rounded-2xl shadow-sm transition-shadow group-hover:shadow-md">
                    <Image
                      src={relatedPost.featuredImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Width Impact CTA */}
      <section className="relative py-25 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Make Your Brand Unforgettable
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-10">
            Join 500+ businesses in Kenya that trust Brandson Media for premium printing and signage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="px-8 h-14 text-lg font-bold" asChild>
              <a href="https://wa.me/254701869821" target="_blank">Start Your Project</a>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-14 text-lg font-bold bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}