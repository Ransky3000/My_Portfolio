# Frontend Agent — Status

**Role:** UI/UX, Next.js components, Framer Motion, CSS styling.
**Last Updated:** 2026-05-13

## Current State
**Status:** 🔄 Active (M5a.1 — Parallel Start)
**Current Branch:** `main` (Hotfix)

## M5a.1 Tasks

### Task 1: Drag-and-Drop Project Reordering (START NOW — No Backend dependency)
- **File:** `/admin/projects/page.tsx`
- **What:** Replace the manual "Order" number column with drag-and-drop row reordering.
- **How:** Install `@dnd-kit/core` and `@dnd-kit/sortable`. Wrap table rows in a sortable context. Add a grip/drag-handle icon (☰ or GripVertical from lucide) as the first column. On drag end, update `display_order` for all affected rows in a batch Supabase update. Remove the "ORDER" column header and number display.
- **Auto-save:** After each drag, immediately persist the new order to Supabase.

### Task 2: Auto-Dismiss Notification Bar (START NOW — No Backend dependency)
- **Files:** ALL admin pages — `/admin/projects/page.tsx`, `/admin/settings/page.tsx`, `/admin/social/page.tsx`, `/admin/messages/page.tsx`
- **Bug:** The green/red notification bar (e.g., "Project deleted.", "Settings saved successfully!") stays on screen forever.
- **Fix:** Add a `useEffect` that watches the `message` state — when a message appears, set a `setTimeout` of ~3 seconds to clear it. Add a CSS fade-out transition so it disappears smoothly instead of snapping away.

### Task 3: Visibility Dropdown (⏳ WAIT for Backend migration)
- **Dependency:** The Backend Agent is migrating `featured` (boolean) → `visibility` (text: 'hidden' | 'visible' | 'featured'). **Do NOT start this until Backend confirms the migration is done.**
- **File:** `/admin/projects/page.tsx`
- **What:** Replace the "Featured: Yes/No" badge column with a `<select>` dropdown showing three options:
  - `hidden` — gray badge — project not shown on public site
  - `visible` — blue badge — project shown on public site
  - `featured` — green badge — project shown AND highlighted
- **Auto-save:** On dropdown change, immediately update the row in Supabase.
- **Update interface:** Change `featured: boolean` → `visibility: 'hidden' | 'visible' | 'featured'` in the Project interface.
- **Update `ProjectCard.tsx`:** Change the `Project` export interface accordingly.
- **Update `Projects.tsx`:** Add `.neq('visibility', 'hidden')` to the Supabase query so hidden projects are filtered from the public site.

### Task 4: Site Title Caching Fix (from Bug 4)
- **File:** `layout.tsx`, `Navbar.tsx` / `ConditionalNavbar.tsx`
- **What:** Move the `site_title` Supabase fetch out of the Server Component (`layout.tsx`) and into the Client Component (`Navbar.tsx`) using `useEffect`, exactly like `Hero.tsx` does. This prevents Vercel from caching the title at build time.

## Completed Work (M5a)
- [x] Dynamic Hero & Footer
- [x] Full Admin Panel CRUD
- [x] Admin CMS link in Navbar
- [x] Next.js image config fixes

## Active Blockers
- Task 3 blocked on Backend migration (featured → visibility).
