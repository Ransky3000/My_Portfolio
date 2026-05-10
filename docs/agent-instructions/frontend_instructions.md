# Frontend Agent — Instructions

## Your Role
You are the **Frontend Developer** for the My_Portfolio project. You are responsible for everything in the `frontend/` folder — the Next.js application, UI components, styling, and animations. You will receive Supabase credentials and API handler code from the Backend agent.

---

## Finalized Tech Stack (Do NOT deviate)

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js (App Router) + TypeScript |
| **Styling** | Vanilla CSS (CSS Modules for component-scoped styles) |
| **Animations** | Motion / Framer Motion (`framer-motion`) |
| **Icons** | Lucide React (`lucide-react`) |
| **Typography** | Inter from Google Fonts |
| **DB Client** | `@supabase/supabase-js` (to fetch project data) |

---

## Design Direction

> **Theme:** Dark-mode-first, premium, futuristic
> 
> - **Background:** Deep navy/charcoal (`#0a0a1a` → `#111827`)
> - **Cards:** Glassmorphism — frosted glass with `backdrop-filter: blur()`, semi-transparent borders
> - **Accents:** Cyan-to-purple gradient (`#06b6d4` → `#8b5cf6`)
> - **Text:** White (`#f8fafc`) for headings, muted gray (`#94a3b8`) for body
> - **Hover effects:** Subtle glow + scale transforms
> - **Font:** Inter (400, 500, 600, 700 weights)
> - **Animations:** Smooth scroll reveals, staggered text entry, hover micro-interactions

---

## Your Working Directory

```
My_Portfolio/
├── frontend/
│   ├── public/
│   │   ├── images/                  # Project thumbnails, profile photo
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home (all sections composed here)
│   │   │   ├── globals.css          # Design system + CSS variables
│   │   │   └── api/
│   │   │       └── contact/
│   │   │           └── route.ts     # Contact API (code from Backend agent)
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/
│   │   │   └── supabase.ts          # Supabase client init
│   │   └── styles/
│   │       ├── navbar.module.css
│   │       ├── hero.module.css
│   │       ├── about.module.css
│   │       ├── projects.module.css
│   │       ├── contact.module.css
│   │       └── footer.module.css
│   ├── .env.local
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
```

---

## Tasks (In Order)

### Task 1: Initialize Next.js Project
```bash
# Run from My_Portfolio/frontend/
npx -y create-next-app@latest ./ --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*"
```
- This initializes Next.js with App Router + TypeScript + ESLint
- The `--no-tailwind` flag is important — we use Vanilla CSS

Then install dependencies:
```bash
npm install framer-motion lucide-react @supabase/supabase-js
```

### Task 2: Design System — `globals.css`
Create the full design system with CSS custom properties:
```css
:root {
  /* Colors */
  --bg-primary: #0a0a1a;
  --bg-secondary: #111827;
  --bg-card: rgba(17, 24, 39, 0.6);
  --border-glass: rgba(255, 255, 255, 0.08);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-cyan: #06b6d4;
  --accent-purple: #8b5cf6;
  --gradient-accent: linear-gradient(135deg, #06b6d4, #8b5cf6);

  /* Spacing */
  --section-padding: 6rem 2rem;
  --container-max: 1200px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Glass effect */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-blur: blur(12px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);

  /* Shadows */
  --shadow-glow: 0 0 30px rgba(6, 182, 212, 0.15);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-smooth: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

html { scroll-behavior: smooth; }
```

### Task 3: Root Layout — `layout.tsx`
- Import Inter from `next/font/google`
- Set metadata: title, description, Open Graph tags
- Include `<Navbar />` component
- Wrap children in a `<main>` tag

### Task 4: Build Components

#### `Navbar.tsx`
- Sticky top navigation, transparent on top, frosted glass on scroll
- Logo/name on the left
- Navigation links: About, Projects, Contact
- Mobile hamburger menu
- Smooth scroll to sections via anchor links (`#about`, `#projects`, `#contact`)

#### `Hero.tsx`
- Full viewport height (`100vh`)
- Animated gradient background (subtle shifting colors)
- Name + title with staggered text reveal using Framer Motion
- Two CTA buttons: "View Projects" → `#projects`, "Contact Me" → `#contact`
- Optional: floating geometric shapes or particles in background

#### `About.tsx`
- Section ID: `#about`
- Brief professional bio paragraph
- Skills displayed as animated pill/tag badges
- Skills to include: `C`, `Python`, `TypeScript`, `Next.js`, `React`, `Supabase`, `PostgreSQL`, `Embedded Systems`, `PIC Microcontrollers`, `ESP32`, `Firebase`, `Git`
- Glassmorphism card container
- Framer Motion fade-in on scroll

#### `Projects.tsx` + `ProjectCard.tsx`
- Section ID: `#projects`
- Fetch project data from Supabase `projects` table
- Display as a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- `ProjectCard` includes: image thumbnail, title, description, tech stack tags, links (live + GitHub)
- Hover effect: slight scale up + glow border + card lift shadow
- Framer Motion staggered reveal on scroll

#### `Contact.tsx`
- Section ID: `#contact`
- Form with fields: Name, Email, Message
- Client-side validation before submit
- POST to `/api/contact` route
- Success/error state with animated feedback
- The API route handler code will be provided by the Backend agent — place it in `frontend/src/app/api/contact/route.ts`

#### `Footer.tsx`
- Social icons using Lucide: GitHub, Linkedin, Mail
- Copyright: `© 2026 [Name]. All rights reserved.`
- Subtle "Built with Next.js + Supabase" text

### Task 5: Compose Page — `page.tsx`
```tsx
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
```

### Task 6: Supabase Client — `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Set up `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<from Backend agent>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Backend agent>
```

### Task 7: Responsive Design
Ensure all components work at these breakpoints:
- **Mobile:** 375px
- **Tablet:** 768px
- **Desktop:** 1440px

### Task 8: SEO
In `layout.tsx` metadata:
```typescript
export const metadata = {
  title: 'Ranian | Developer Portfolio',
  description: 'Full-stack developer specializing in embedded systems, web development, and research.',
  openGraph: {
    title: 'Ranian | Developer Portfolio',
    description: 'Full-stack developer specializing in embedded systems, web development, and research.',
    type: 'website',
  },
};
```

---

## Dependencies on Backend Agent

You will need these from the Backend agent before completing Tasks 4-6:
1. **Supabase URL** → goes in `.env.local`
2. **Supabase Anon Key** → goes in `.env.local`
3. **`projects` table schema** → so you know the fields to query/display
4. **Contact API route handler** → place in `frontend/src/app/api/contact/route.ts`

> **You can start Tasks 1-3 immediately** without waiting for the Backend agent.

---

## Rules
- Use **Vanilla CSS** with CSS Modules — no Tailwind, no styled-components
- Every component must have a unique section `id` for scroll navigation
- Every interactive element must have a unique, descriptive HTML `id` for testing
- Preserve the premium dark aesthetic — avoid flat/generic colors
- Use `'use client'` directive ONLY on components that need client-side interactivity (animations, forms, state)
- Use Next.js `<Image />` component for all images (performance optimization)
- Do NOT modify anything in `backend/` or `docs/` — those belong to other agents
