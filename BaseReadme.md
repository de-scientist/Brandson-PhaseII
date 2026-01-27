## Brandson Media Phase II – Site Overview

**Brandson Media** is a full‑service printing, branding, signage, UV printing, and promotional solutions company based in Nairobi, Kenya.  
This repository contains the Phase II version of the official marketing website, built with a modern Next.js stack and integrated with Sanity CMS for dynamic content.

---

## What the Site Does

- **Showcases services**: Detailed breakdown of printing, branding, signage, UV printing, laser cutting, paper printing, hotel/conference, and training support services.
- **Presents portfolio work**: Filterable gallery plus a link to a full external photo gallery, highlighting real client projects.
- **Builds trust**: Dedicated testimonials page with sector‑specific success stories and quantified stats (clients, projects, years, satisfaction).
- **Educates via content**: Blog and individual article pages offering tips and insights on printing, branding, and signage in Nairobi and across Kenya.
- **Drives enquiries**: Multiple CTAs to WhatsApp, contact forms, and internal navigation that guide users toward requesting quotes or starting projects.

The overall goal is to convert visitors (especially Kenyan SMEs, corporates, hotels, institutions, and event organizers) into high‑intent leads.

---

## Tech Stack (from the Code)

- **Framework**: Next.js `16` (App Router, `app/` directory)
- **Language**: React `19` with TypeScript
- **Styling**: Tailwind CSS `v4` + custom CSS in `app/globals.css` and `styles/globals.css`
- **UI Library**: shadcn‑style components (buttons, cards, inputs, dropdowns) under `components/ui/`
- **Icons**: `lucide-react`
- **Theming**: `next-themes` via `components/theme-provider`
- **Analytics & Performance**: `@vercel/analytics` and `@vercel/speed-insights`
- **Content**:
  - **Sanity CMS** (`lib/sanity.ts`) for home hero content and featured services
  - Local blog data (`lib/blog-data.tsx`) powering the blog index and blog details for now
- **Markdown Rendering**: `react-markdown` + `remark-gfm` for blog article bodies
- **Tooling**: TypeScript, PostCSS, Tailwind CSS, ESLint

---

## High‑Level Architecture

- **App Router** (`app/`)
  - `layout.tsx`: Root layout that sets up:
    - Global fonts (Inter and Geist Mono)
    - Global SEO metadata (title, description, Open Graph and Twitter cards, canonical URL)
    - `<ThemeProvider>` for light/dark theme support
    - Vercel Analytics and Speed Insights
  - `page.tsx`: Home page. Server component that:
    - Fetches `HomeDoc` and `ServiceDoc` entries from Sanity
    - Renders the `Navbar`, `HeroSection`, services overview, catalogue preview, portfolio preview, trust logos, and multiple CTAs.
- **Feature Pages**
  - `about/page.tsx`: Brand story, mission, vision, core values, and embedded Google Maps location.
  - `services/page.tsx`: Hard‑coded but structured grid of 10+ service categories with semantic IDs (e.g. `#printing`, `#branding`, `#uv-printing`) that can be deep‑linked from other pages.
  - `portfolio/page.tsx`: Client‑side page with category filters (Branding, Printing, Signage, UV Printing, Events, etc.), image grid, and external link to a larger Google Photos gallery.
  - `blog/page.tsx`: Blog index with filters (`BlogFilters` component), SEO metadata, and a card grid of posts sourced from `lib/blog-data.tsx`.
  - `blog/[slug]/page.tsx`: Individual blog post page that:
    - Looks up posts by slug using `getBlogPost`
    - Renders markdown content via `ReactMarkdown` and `remark-gfm`
    - Shows author, category, date, reading time, featured image, sidebar CTA, and related posts.
  - `contact/page.tsx`:
    - Client component with a contact form (name, email, phone, service, message)
    - On submit, opens a pre‑filled WhatsApp chat for frictionless lead capture
    - Lists contact channels (email, phone, WhatsApp, physical location) and business hours
    - Embeds a Google Map iframe pointing to Brandson Media in Nairobi.
  - `testimonials/page.tsx`: Grid of curated testimonials with headshots, roles, companies, and star ratings plus stats on clients, projects, years, and satisfaction.
  - `catalogue/`: Provides catalogue layout and entry point for browsing a wider set of products linked from the home page.

All major pages reuse `Navbar`, `Footer`, and `WhatsAppButton` for consistent navigation, branding, and calls to action.

---

## Components Overview

- **Layout & Shell**
  - `Navbar`: Top navigation with links to key pages (Home, Services, Portfolio, Blog, About, Contact, etc.) and theme toggle.
  - `Footer`: Company summary, quick links, and contact/social information.
  - `theme-provider` and `theme-toggle`: Wrap the app and expose light/dark mode using `next-themes`.
  - `HeroSection`: Home‑page hero with imagery, headings, and primary CTAs.
- **UI Primitives (`components/ui/`)**
  - `button`, `card`, `badge`, `dropdown-menu`, `input`, `label`, `textarea`, etc.
  - These are reusable, accessible components built in the shadcn style, heavily used across all pages for consistent look and feel.
- **Domain‑Specific Components**
  - `catalogue-item`: Card for catalogue entries.
  - `blog-filters`: Category filters for the blog listing page.
  - `whatsapp-button`: Floating button component that provides an always‑available WhatsApp CTA.

---

## Data & CMS Integration

- **Sanity Client** (`lib/sanity.ts`)
  - Configured with:
    - `projectId: "w5a4azh9"`
    - `dataset: "production"`
    - `apiVersion: "2024-01-01"`
    - `useCdn: true` for cached reads
  - Used on the home page to fetch:
    - `HomeDoc` (title, subtitle, hero images)
    - Featured `ServiceDoc` entries
- **Types** (`lib/types.ts`)
  - `HomeDoc` and `ServiceDoc` define the shape of data consumed from Sanity.
- **Blog Data** (`lib/blog-data.tsx`)
  - In‑repo blog content source (posts, categories, helpers like `getBlogPost` and `getRelatedPosts`).
  - Blog pages read from this module rather than directly from Sanity at the moment.

---

## User Journeys Supported

- **Information‑seeking visitor**
  - Lands on Home → scans services → visits Services and Portfolio → reads Blog or Testimonials → converts via WhatsApp or Contact.
- **High‑intent lead**
  - Lands directly on a Blog article from search → sees contextual CTAs (sidebars and WhatsApp banners) → clicks through to Services or Contact.
- **Existing client**
  - Uses the site as a reference for available services, gallery of past work, or to quickly start a WhatsApp conversation.

Throughout these journeys, the site emphasizes trust (social proof, stats), clarity (structured services grid), and low‑friction communication (multiple WhatsApp and phone CTAs).

---

## How to Run the Project Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create environment variables**

   Create a `.env.local` file in the project root:

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=w5a4azh9
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the site**

   Visit `http://localhost:3000` in your browser.

---

## Project Structure (Simplified)

```text
app/
  layout.tsx          # Root layout, fonts, metadata, theme provider
  page.tsx            # Home page
  about/page.tsx      # About Brandson Media
  services/page.tsx   # Detailed services grid
  portfolio/page.tsx  # Portfolio with filters and gallery link
  blog/page.tsx       # Blog index
  blog/[slug]/page.tsx# Individual blog posts
  contact/page.tsx    # Contact form + WhatsApp integration + map
  testimonials/page.tsx # Client testimonials and stats
  catalogue/          # Catalogue layout and entry point

components/
  HeroSection.tsx
  navbar.tsx
  footer.tsx
  whatsapp-button.tsx
  blog-filters.tsx
  catalogue-item.tsx
  theme-provider.tsx
  theme-toggle.tsx
  ui/                 # shadcn-style UI primitives

lib/
  sanity.ts           # Sanity client configuration
  blog-data.tsx       # Blog posts, categories, helpers
  types.ts            # Shared TypeScript types
  utils.ts            # General utilities

public/
  images, branding shots, portfolio assets, icons, and favicons
```

---

## Business & Contact Details

- **Business**: Brandson Media
- **Location**: Nairobi, Kenya
- **Email**: `brandsonmedia@gmail.com`
- **Phone / WhatsApp**: `+254 701 869821`
- **Primary CTA**: WhatsApp chat and quote requests via the contact form

The entire site is engineered to support Brandson Media’s brand positioning: high‑quality, reliable, and modern printing and branding solutions for Kenyan businesses.

