---

# Brandson Media Phase II Website

A modern, responsive, and **CMS-powered** website for **Brandson Media** — a leading printing, branding, and signage company based in Nairobi, Kenya.

---

## About Brandson Media

**Brandson Media** is a premier printing and branding solutions provider dedicated to helping businesses create powerful visual identities. With over 10 years of experience and 500+ satisfied clients across Kenya, we specialize in:

* **Large Format Printing** — Banners, posters, billboards, wall graphics
* **Signage Solutions** — 3D signs, LED signs, directional signage, shop fronts
* **UV Printing** — High-resolution printing on glass, acrylic, wood, metal
* **Corporate Branding** — Business cards, letterheads, promotional merchandise
* **Vehicle Branding** — Fleet wraps, car graphics, mobile advertising
* **Event Branding** — Roll-up banners, backdrops, tents, exhibition stands

### Mission

To deliver exceptional printing and branding solutions that help businesses stand out, communicate clearly, and leave lasting impressions.

### Vision

To become the most trusted and innovative branding partner across East Africa.

---

## Website Features

### Pages

| Page          | Description                                          |
| ------------- | ---------------------------------------------------- |
| **Home**      | Dynamic hero, services overview, testimonials, CTAs  |
| **Services**  | CMS-driven services with categories and detail views |
| **Portfolio** | Real project showcases managed via CMS               |
| **Blog**      | SEO-optimized content powered by Sanity CMS          |
| **About**     | Company story, mission, vision, and values           |
| **Contact**   | Quote requests, contact form, map, and direct links  |

---

## Key Features

* **Sanity CMS Integration** — Headless CMS for managing content dynamically
* **Fully Dynamic Content** — Services, blogs, testimonials, and media powered by CMS
* **Responsive Design** — Optimized for mobile, tablet, and desktop
* **Modern UI/UX** — Clean layout, subtle motion, premium feel
* **SEO-Optimized** — Metadata, structured content, Open Graph support
* **WhatsApp Integration** — Floating WhatsApp CTA for instant engagement
* **YouTube Video Embeds** — Reusable, responsive video components
* **Accessible by Design** — Semantic HTML and ARIA where needed

---

## CMS: Sanity

This project uses **Sanity CMS** as a headless content platform to enable:

* Real-time content editing
* Structured content (services, blog posts, testimonials, media)
* Scalable content modeling
* Seamless integration with Next.js App Router
* Future support for dashboards, analytics, and content workflows

### CMS-Driven Content Types

* Services & service categories
* Blog posts (`/blog` & `/blog/[slug]`)
* Testimonials
* Client logos
* Homepage sections & CTAs

---

## Tech Stack

| Technology                                                | Purpose                         |
| --------------------------------------------------------- | ------------------------------- |
| [Next.js 14](https://nextjs.org/)                         | React framework with App Router |
| [React](https://react.dev/)                               | UI rendering                    |
| [TypeScript](https://www.typescriptlang.org/)             | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)                  | Styling                         |
| [Sanity CMS](https://www.sanity.io/)                      | Headless content management     |
| [shadcn/ui](https://ui.shadcn.com/)                       | Accessible UI components        |
| [Lucide Icons](https://lucide.dev/)                       | Icon system                     |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/Light mode                 |
| [Framer Motion](https://www.framer.com/motion/)           | Animations                      |

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm, yarn, or pnpm
* Sanity account (free tier supported)

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/brandson-media-website.git
cd brandson-media-website
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open**
   Visit [http://localhost:3000](http://localhost:3000)

---

## Sanity Studio (CMS)

The Sanity Studio is deployed separately on **Sanity Cloud** and connects to this frontend via API.

* Content updates go live instantly
* No redeploy required for content changes
* CMS can be accessed by authorized editors only

---

## Project Structure

```
brandson-media-website/
├── app/
│   ├── blog/
│   │   └── [slug]/
│   ├── services/
│   ├── about/
│   ├── contact/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── cms/
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── youtube-embed.tsx
├── lib/
│   └── sanity.ts
├── public/
│   └── images/
├── README.md
└── package.json
```

---

## Deployment

* **Frontend:** Vercel
* **CMS:** Sanity Cloud
* **Images:** Sanity Image CDN + Next.js Image Optimization

---

## Contact Information

**Brandson Media**

* **Location:** Nairobi, Kenya
* **Email:** [brandsonmedia@gmail.com](mailto:brandsonmedia@gmail.com)
* **Phone / WhatsApp:** [+254 701 869821](https://wa.me/254701869821)

### Social Media

* Facebook — [https://www.facebook.com/brand350/](https://www.facebook.com/brand350/)
* Instagram — [https://www.instagram.com/brandsonmedia/](https://www.instagram.com/brandsonmedia/)
* LinkedIn — [https://www.linkedin.com/company/brandsonmedia](https://www.linkedin.com/company/brandsonmedia)
* TikTok — [https://www.tiktok.com/@brandsonmedia](https://www.tiktok.com/@brandsonmedia)
* YouTube — [https://www.youtube.com/@brandsonmedia](https://www.youtube.com/@brandsonmedia)

---

## License

This project is proprietary software owned by **Brandson Media**.
All rights reserved.

---

## Acknowledgments

* Built with **Next.js** and deployed on **Vercel**
* CMS powered by **Sanity**
* UI components from **shadcn/ui**
* Icons from **Lucide**

---

**Brandson Media** — *Your Brand, Our Passion.*

---

