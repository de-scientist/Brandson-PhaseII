import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { EcommerceCartProvider } from "@/contexts/ecommerce-cart-context"
import { MainNavigation } from "@/components/main-navigation"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import "./globals.css"

// Fonts (performance + SEO via Core Web Vitals)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

// Global SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://brandsonmedia.co.ke"),

  title: {
    default: "Brandson Media | Printing, Branding & Signage Solutions in Nairobi",
    template: "%s | Brandson Media",
  },

  description:
    "Brandson Media is a Nairobi-based full-service printing, branding, signage, UV printing, and promotional solutions company serving businesses, hotels, institutions, and events across Kenya.",

  keywords: [
    "printing Nairobi",
    "branding Kenya",
    "signage Nairobi",
    "UV printing Kenya",
    "vehicle branding",
    "corporate printing",
    "promotional materials",
    "3D signage",
  ],

  alternates: {
    canonical: "https://brandsonmedia.co.ke",
  },

  openGraph: {
    title: "Brandson Media | Printing & Branding Solutions in Nairobi",
    description: "Professional printing, branding, signage, UV printing, and promotional solutions in Nairobi, Kenya.",
    url: "https://brandsonmedia.co.ke",
    siteName: "Brandson Media",
    locale: "en_KE",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Brandson Media | Printing & Branding in Nairobi",
    description: "Quality printing, signage, UV printing, and branding services for businesses and events in Kenya.",
  },

  icons: {
    icon: "/images/web-app-manifest-192x192.png",
    shortcut: "/images/web-app-manifest-192x192.png",
    apple: "/images/web-app-manifest-192x192.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <EcommerceCartProvider>
              <div className="min-h-screen flex flex-col">
                <MainNavigation />
                <main className="flex-1">
                  {children}
                </main>
                <EnhancedFooter />
              </div>
              <WhatsAppButton />
            </EcommerceCartProvider>
          </CartProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
