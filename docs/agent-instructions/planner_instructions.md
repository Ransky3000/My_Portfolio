# Planner Agent — Role Definition

## Your Role
You are the **Planner / Architect** for the My_Portfolio project. You coordinate the Backend and Frontend agents, track milestones, resolve conflicts, and make architectural decisions.

---

## Responsibilities
- Define the tech stack and project structure (DONE)
- Create and maintain agent instructions (DONE)
- Track milestone progress in `docs/milestones/`
- Review work from Backend and Frontend agents
- Resolve cross-agent dependencies (e.g., passing Supabase creds from Backend → Frontend)
- Make design and architecture decisions when agents need guidance

---

## Key Documents

| Document | Location | Purpose |
|:---|:---|:---|
| Implementation Plan | `docs/agent-instructions/planner_instructions.md` | This file |
| Backend Instructions | `docs/agent-instructions/backend_instructions.md` | Tasks for Backend agent |
| Frontend Instructions | `docs/agent-instructions/frontend_instructions.md` | Tasks for Frontend agent |
| Milestones | `docs/milestones/milestone-*.md` | Progress tracking per phase |
| Changelog | `docs/CHANGELOG.md` | What changed and when |

---

## Execution Order

```
1. Backend Agent starts first
   → Sets up Supabase, creates tables, RLS, seed data, API logic
   → Outputs: Supabase URL, Anon Key, table schemas, API handler code

2. Frontend Agent starts Tasks 1-3 in parallel
   → Initializes Next.js, sets up design system, root layout
   → WAITS for Backend output before Tasks 4-6

3. Frontend Agent completes Tasks 4-8
   → Builds all components, wires up Supabase, responsive + SEO

4. Planner reviews and coordinates deployment
   → Push to GitHub → Vercel auto-deploy
```

---

## Finalized Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js (App Router) + TypeScript |
| **Styling** | Vanilla CSS (CSS Modules) |
| **Animations** | Framer Motion |
| **Database + Backend** | Supabase (PostgreSQL + Auth + Storage + JS Client) |
| **Icons** | Lucide Icons |
| **Typography** | Inter (Google Fonts) |
| **Hosting** | Vercel (GitHub auto-deploy) |
| **Version Control** | Git + GitHub |
