import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
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
  title: "Brandson Media | Printing & Branding Solutions",
  description: "Professional printing, signage, UV printing, and branding services for businesses and events in Kenya.",
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
          <div className="min-h-screen">
            {/* Simple Header */}
            <header className="border-b bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold">Brandson Media</h1>
                  </div>
                  <nav className="flex items-center space-x-4">
                    <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="/services" className="text-gray-600 hover:text-gray-900">Services</a>
                    <a href="/portfolio" className="text-gray-600 hover:text-gray-900">Portfolio</a>
                    <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                  </nav>
                </div>
              </div>
            </header>
            
            <main>
              {children}
            </main>
            
            {/* Simple Footer */}
            <footer className="border-t bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                  <p className="text-gray-600">© 2024 Brandson Media. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
