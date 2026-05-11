# Ranian J. Rulona — Portfolio

A professional developer portfolio built with **Next.js 14**, **Supabase**, and **Framer Motion**. Showcases embedded systems engineering, AI automation, IoT solutions, and full-stack web development projects.

## 🚀 Live Demo

> Coming soon — deployment via Vercel is pending.

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | Next.js 14 (App Router), TypeScript, CSS Modules, Framer Motion |
| **Backend** | Supabase (PostgreSQL), Next.js API Routes, Zod validation |
| **Deployment** | Vercel (planned) |
| **Version Control** | Git (GitFlow-lite branching strategy) |

## 📁 Project Structure

```
My_Portfolio/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages and API routes
│   │   ├── components/# React components (Hero, About, Projects, etc.)
│   │   ├── lib/       # Supabase client configuration
│   │   └── styles/    # CSS Modules
│   └── public/        # Static assets (images, CV)
├── backend/           # Supabase configuration and seed data
├── docs/              # Multi-agent workflow documentation
│   ├── agent-instructions/  # Role-specific instructions
│   ├── status/              # Agent status tracking
│   ├── issues/              # Shared issue log
│   └── knowledge/           # Shared knowledge base
└── .github/           # Contributing guidelines
```

## 🏗️ Development Workflow

This project uses a **multi-agent AI development system** with 4 specialized roles:

- 📋 **Planner** — Architecture, QA, and Git merge management
- 🔧 **Backend** — Supabase schema, RLS policies, API routes
- 🎨 **Frontend** — UI/UX components, animations, styling
- ⚙️ **DevOps** — Deployment, CI/CD, Git tagging (SemVer)

All agents follow a GitFlow-lite branching strategy (`main` → `dev` → `feature/*`) and communicate via file-based status reports.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📄 License

This project is licensed under the GNU General Public License v3.0 — see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- **GitHub:** [Ransky3000](https://github.com/Ransky3000)
- **LinkedIn:** [Ranian J. Rulona](https://www.linkedin.com/in/ranianrulona)
- **Upwork:** [Ranian R.](https://www.upwork.com/freelancers/~01d2b5850b4acf7f64)
