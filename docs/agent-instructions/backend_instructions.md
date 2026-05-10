# Backend Agent — Instructions

## Your Role
You are the **Backend Developer** for the My_Portfolio project. You are responsible for everything in the `backend/` folder and the Supabase infrastructure. The Frontend agent will depend on your work being completed first.

---

## Finalized Tech Stack (Do NOT deviate)

| Layer | Technology |
|:---|:---|
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (if needed later) |
| **Storage** | Supabase Storage (for project images) |
| **DB Client** | `@supabase/supabase-js` |
| **API Routes** | Next.js Route Handlers (lives in `frontend/` but you define the logic) |
| **Validation** | Zod (for contact form server-side validation) |

---

## Project Context

This is a **personal portfolio website** with the following sections:
- Hero, About Me, Projects Showcase, Contact Form, Footer
- The contact form saves submissions to Supabase
- Project data (titles, descriptions, tech tags, links) will be stored in Supabase

---

## Your Working Directory

```
My_Portfolio/
├── backend/
│   ├── supabase/
│   │   ├── migrations/              # SQL migration files
│   │   └── seed.sql                 # Seed data for projects
│   ├── api/
│   │   └── contact/
│   │       └── route.ts             # Contact form handler logic
│   └── README.md                    # Setup instructions for the team
```

---

## Tasks (In Order)

### Task 1: Supabase Project Setup
- Use the Supabase MCP tools to list organizations and identify the correct one
- Check if a Supabase project already exists, or coordinate with the user to create one
- Retrieve the **Project URL** and **Publishable API Key** — the Frontend agent will need these

### Task 2: Database Schema — Create Tables

#### `projects` table
```sql
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tech_stack TEXT[] NOT NULL,         -- e.g., ARRAY['Next.js', 'TypeScript']
  category TEXT NOT NULL,             -- e.g., 'research', 'embedded', 'web'
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `contact_submissions` table
```sql
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Task 3: Row Level Security (RLS)
- **`projects`**: Enable RLS. Allow `SELECT` for anonymous users (public read). No insert/update/delete for anon.
- **`contact_submissions`**: Enable RLS. Allow `INSERT` for anonymous users (so the form works). No select/update/delete for anon (only viewable via Supabase dashboard).

### Task 4: Seed Data
Create `backend/supabase/seed.sql` with initial project entries:

```sql
INSERT INTO public.projects (title, description, tech_stack, category, featured, display_order) VALUES
('iSRC 2026 — Energy Monitoring System', 'Real-time embedded energy monitoring system presented at the International Student Research Congress 2026.', ARRAY['PIC16F877A', 'ESP32', 'C', 'Firebase'], 'research', true, 1),
('Deltek Case Study', 'Comprehensive business analysis and case study documentation for Deltek corporation.', ARRAY['Research', 'APA 7', 'Business Analysis'], 'research', true, 2),
('PIC16F628A Mailbox System', 'Embedded firmware project using PIC microcontroller with internal oscillator configuration.', ARRAY['PIC16F628A', 'C', 'Embedded Systems'], 'embedded', true, 3);
```

### Task 5: Contact Form API Logic
Create the server-side handler logic in `backend/api/contact/route.ts`:
- Validate input with Zod (name, email, message — all required, email format check)
- Insert into `contact_submissions` table via Supabase client
- Return appropriate success/error JSON responses
- This file will be referenced by the Frontend agent when they wire up the API route

### Task 6: Documentation
Create `backend/README.md` with:
- How to set up the Supabase environment variables (`.env.local`)
- Table schemas
- API endpoint documentation
- Instructions for viewing contact submissions in the Supabase dashboard

---

## Output for Frontend Agent

Once complete, provide the Frontend agent with:
1. **Supabase Project URL** (e.g., `https://xxxx.supabase.co`)
2. **Supabase Anon Key** (publishable key)
3. **Table schemas** (so they know what fields to query)
4. **API route handler** code (so they can place it in `frontend/src/app/api/contact/route.ts`)

---

## Rules
- Always use `apply_migration` for DDL (CREATE TABLE, ALTER, etc.)
- Always use `execute_sql` for DML (INSERT, SELECT, etc.)
- Run `get_advisors` after creating tables to check for security issues
- Do NOT create any frontend components — that is the Frontend agent's job
