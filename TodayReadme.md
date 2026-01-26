# Brandson Media Website - Today's Overview

## What This Website Does

This is a modern, professional website for **Brandson Media**, a leading printing and branding company in Nairobi, Kenya. The site showcases their services, portfolio, and provides multiple ways for potential clients to get in touch.

## Current Features

### Pages Built
- **Home** - Hero section, services overview, why choose us section, portfolio preview, testimonials
- **Services** - Comprehensive listing of all 10+ service categories with detailed breakdowns
- **Portfolio** - Showcase of recent projects organized by category
- **Blog** - Content management powered by Sanity CMS
- **About** - Company story and information
- **Contact** - Quote request form and contact methods
- **Testimonials** - Client reviews and feedback

### Key Capabilities
- Dark/Light theme toggle
- Responsive mobile, tablet, and desktop design
- WhatsApp integration for instant messaging
- Modern card-based UI components
- Real-time content management via Sanity CMS
- SEO optimized structure

## Services Offered
1. Printing & Stickers (banners, vehicle branding, labels)
2. Corporate Branding (apparel, uniforms, merchandise)
3. UV Printing (promotional items, gifts, custom merchandise)
4. Hotel & Conference Solutions (branded materials for events)
5. Training Centre Support (manuals, awards, certificates)
6. Paper Printing (business cards, brochures, company profiles)
7. Laser Cutting & Engraving (acrylic, wood, custom items)
8. Signage & 3D Signs (for restaurants, hotels, buildings, retail)
9. Acrylic Displays (menu holders, price tags, promotional stands)
10. Additional Services (wedding cards, calendars, event branding, vehicle wrapping)

## Tech Stack
- **Frontend Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with custom theme
- **Components**: shadcn/ui (accessible, reusable components)
- **CMS**: Sanity CMS (headless content management)
- **Icons**: Lucide React
- **Theming**: next-themes (dark/light mode)
- **Forms**: React Hook Form with Zod validation
- **Type Safety**: TypeScript

## Project Structure
```
├── app/                 # Next.js pages and layouts
│   ├── blog/           # Blog and individual posts
│   ├── services/       # Services page
│   ├── portfolio/      # Portfolio showcase
│   ├── about/          # About page
│   ├── contact/        # Contact form
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable React components
│   ├── ui/            # shadcn UI components
│   ├── navbar.tsx     # Navigation bar
│   ├── footer.tsx     # Footer
│   └── theme-toggle.tsx
├── lib/               # Utilities and helpers
│   ├── sanity.ts      # Sanity CMS client
│   └── utils.ts
├── public/            # Static assets and images
└── styles/            # Global CSS
```

## Quick Development Notes

### Running the App
- Development server runs automatically in the environment
- Access at `http://localhost:3000`

### Styling
- Uses Tailwind CSS v4 with custom theme configuration
- Theme variables defined in tailwind config
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)
- Dark mode support built-in

### CMS Integration
- Sanity CMS is used for blog posts and dynamic content
- No rebuilds needed for content changes
- Content updates go live instantly

### UI Components
- All components from shadcn/ui (buttons, cards, forms, etc.)
- Located in `components/ui/`
- Highly customizable and accessible

## Key Contact Info
- **Email**: brandsonmedia@gmail.com
- **WhatsApp**: +254 701 869821
- **Location**: Nairobi, Kenya
- **Social**: Facebook, Instagram, LinkedIn, TikTok, YouTube

## Next Steps / Future Considerations
- Consider adding payment integration for online ordering
- Expand blog content with industry tips and case studies
- Add client testimonial video embeds
- Implement advanced portfolio filtering
- Set up analytics and conversion tracking
- Create admin dashboard for quote management
