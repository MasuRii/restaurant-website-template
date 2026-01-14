# Risū & Oak - Restaurant Website Template

<div align="center">

![Astro](https://img.shields.io/badge/Astro-5.16.9-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

[![Deploy](https://img.shields.io/github/actions/workflow/status/MasuRii/restaurant-website-template/deploy.yml?branch=main&style=flat-square&logo=github&label=deploy)](https://github.com/MasuRii/restaurant-website-template/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/badge/version-0.0.1-blue?style=flat-square)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

**A high-performance, accessible, and SEO-optimized restaurant website template built with Astro, React, and Tailwind CSS.**

![Screenshot of the Website](src/assets/images/image.png)

[Live Demo](https://masurii.github.io/restaurant-website-template/) | [Documentation](#-documentation) | [Quick Start](#-quick-start)

</div>

---

## Features

- **Blazing Fast** - Built with Astro for optimal performance and minimal JavaScript
- **Modern Stack** - React 19, Tailwind CSS 4, and TypeScript for type safety
- **Reservation System** - Interactive reservation form with date/time selection
- **Dynamic Menu** - JSON-based menu management with category filtering
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Fully Responsive** - Mobile-first design that looks great on all devices
- **SEO Optimized** - Built-in sitemap, meta tags, and structured data (JSON-LD)
- **Accessibility First** - WCAG 2.1 AA compliant with keyboard navigation
- **i18n Ready** - Internationalization support with i18next
- **Performance Monitoring** - Web Vitals integration for real user monitoring
- **Interactive Map** - Leaflet.js + OpenStreetMap integration (no API key required)
- **Instagram Feed** - Social media integration showcase

## Tech Stack

| Category                 | Technology                                       |
| ------------------------ | ------------------------------------------------ |
| **Framework**            | [Astro](https://astro.build) v5.16.9             |
| **UI Library**           | [React](https://react.dev) v19.2.3               |
| **Styling**              | [Tailwind CSS](https://tailwindcss.com) v4.1.18  |
| **Internationalization** | [i18next](https://www.i18next.com) v25.7.4       |
| **Image Optimization**   | [Sharp](https://sharp.pixelplumbing.com) v0.34.5 |
| **Performance**          | [Web Vitals](https://web.dev/vitals/) v5.1.0     |
| **E2E Testing**          | [Playwright](https://playwright.dev) v1.57.0     |
| **Deployment**           | [Vercel](https://vercel.com)                     |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (recommended) or [Node.js](https://nodejs.org) 18+
- [Git](https://git-scm.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/MasuRii/restaurant-website-template.git
cd restaurant-website-template

# Install dependencies
bun install  # or npm install

# Start development server
bun dev  # or npm run dev
```

The site will be available at `http://localhost:4321`

## Commands

All commands are run from the root of the project:

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `bun install`      | Install dependencies                       |
| `bun dev`          | Start local dev server at `localhost:4321` |
| `bun build`        | Build production site to `./dist/`         |
| `bun preview`      | Preview production build locally           |
| `bun run lint`     | Run ESLint for code quality                |
| `bun run lint:fix` | Run ESLint and auto-fix issues             |
| `bun run format`   | Run Prettier for code formatting           |
| `bun test`         | Run unit tests                             |
| `bun run test:e2e` | Run E2E tests with Playwright              |
| `bun run deploy`   | Deploy to Vercel                           |

## Project Structure

```
restaurant-website-template/
├── public/                    # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/               # Images and fonts
│   │   └── images/           # Optimized images (hero, gallery, etc.)
│   ├── components/
│   │   ├── analytics/        # Web Vitals and performance monitoring
│   │   ├── ui/               # UI components (OptimizedImage, etc.)
│   │   ├── Header.astro      # Navigation header
│   │   ├── Footer.astro      # Site footer with contact info
│   │   ├── Hero.astro        # Landing hero section
│   │   ├── Menu.astro        # Menu display section
│   │   ├── MenuDisplay.tsx   # Interactive menu component
│   │   ├── ReservationForm.tsx # Booking form component
│   │   ├── Gallery.astro     # Photo gallery section
│   │   ├── Testimonials.astro # Customer reviews
│   │   └── ...               # Other components
│   ├── data/                 # JSON content files
│   │   ├── restaurant.json   # Restaurant info (name, hours, contact)
│   │   ├── menu.json         # Menu items and categories
│   │   ├── gallery.json      # Gallery images
│   │   ├── testimonials.json # Customer testimonials
│   │   ├── events.json       # Special events
│   │   └── team.json         # Team members
│   ├── layouts/              # Page layouts
│   ├── lib/                  # Utility functions
│   │   ├── analytics.ts      # Analytics utilities
│   │   ├── web-vitals.ts     # Performance monitoring
│   │   ├── i18n.ts           # Internationalization setup
│   │   └── image-presets.ts  # Image optimization presets
│   ├── locales/              # Translation files
│   │   └── en/common.json    # English translations
│   ├── pages/                # Astro pages
│   │   ├── index.astro       # Home page
│   │   └── 404.astro         # Error page
│   └── styles/               # Global CSS
│       └── global.css        # Tailwind and custom styles
├── tests/                    # Test files
│   └── unit/                 # Unit tests
├── docs/                     # Documentation
│   ├── research/             # Research & Strategy docs
│   └── wireframes/           # Wireframes & Architecture
└── package.json
```

## Customization

### Content

Edit the JSON files in `src/data/` to update your restaurant content:

- **`restaurant.json`** - Restaurant name, address, phone, hours, social links
- **`menu.json`** - Menu items with categories, descriptions, prices
- **`gallery.json`** - Gallery images for food and interior
- **`testimonials.json`** - Customer reviews and ratings
- **`events.json`** - Special events and seasonal offerings
- **`team.json`** - Chef and staff information

### Styling

The project uses Tailwind CSS with a custom design system. Key customization points:

- Colors and theme variables in `src/styles/global.css`
- Typography using Playfair Display and DM Sans fonts
- Component-specific styles in their respective `.astro` files

### Translations

Update or add translations in `src/locales/` for multi-language support.

## Deployment

This project supports both **GitHub Pages** and **Vercel** deployment:

### GitHub Pages (Automatic)

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings (Settings → Pages → Source: GitHub Actions)
3. The included workflow will automatically build and deploy on every push to `main`
4. Your site will be available at `https://<username>.github.io/<repo-name>/`

### Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Deploy!

Or use the CLI:

```bash
bun run deploy
```

### Other Platforms

For other platforms, run `bun build` and deploy the `dist/` folder.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

We follow:

- [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- ESLint and Prettier for code style

---

<div align="center">

**Built with love by [MasuRii](https://github.com/MasuRii)**

If you found this helpful, please consider giving it a star!

[![GitHub stars](https://img.shields.io/github/stars/MasuRii/restaurant-website-template?style=social)](https://github.com/MasuRii/restaurant-website-template)

</div>
