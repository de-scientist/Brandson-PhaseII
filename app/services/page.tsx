import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedHero } from "@/components/animated-hero"
import { MotionSection } from "@/components/motion-section"
import { ServiceCard } from "@/components/service-card"
import { sanityClient } from "@/lib/sanity"
import { servicesWithCategoriesQuery } from "@/lib/queries"

export const revalidate = 60

export default async function ServicesPage() {
  const categories = await sanityClient.fetch(servicesWithCategoriesQuery)

  return (
    <div className="min-h-screen">
      <Navbar />

      <AnimatedHero pageKey="services" />

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category: any) => (
              <MotionSection key={category._id} delay={0.03}>
                <Card
                  id={category.slug?.current}
                  className="bg-card border-border scroll-mt-24"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {category.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-card-foreground">
                          {category.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.services.map((service: any) => (
                        <ServiceCard
                          key={service._id}
                          service={service}
                          categoryIconKey={category.iconKey}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </MotionSection>
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
