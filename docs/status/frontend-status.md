# Frontend Agent — Status

**Role:** UI/UX, Next.js components, Framer Motion, CSS styling.
**Last Updated:** 2026-05-12

## Current State
**Status:** 💤 Idle (Vercel Cache Bug Fixed)
**Current Branch:** `main`

## QA Feedback / Bugs (Assigned to Frontend)
- No active bugs.

## Completed Work (M5a)

### Phase 1 — Dynamic Hero & Footer
- [x] Hero fetches `site_settings` (headline, subtitle, cv_url) with graceful fallback
- [x] Footer fetches `social_links` (ordered, visible-only) with icon rendering by `icon_name`
- [x] Footer text reads from `site_settings.footer_text`

### Feature Request: Public Admin Login Link
- **Issue:** The Director wants recruiters/visitors to know there is a custom CMS powering this portfolio to showcase full-stack skills.
- **Fix Required:** Add a subtle "Admin" or "CMS Login" link to the **top Navbar** (`Navbar.tsx`). Make it look professional but easily discoverable alongside the other navigation links (About, Projects, Contact).

### Phase 2 — Admin Panel
- [x] `/admin/login` — Email/password auth via Supabase
- [x] `/admin` — Protected dashboard with stats
- [x] `/admin/settings` — Site settings form with profile image & CV upload
- [x] `/admin/projects` — Full CRUD with image upload, category select, featured toggle
- [x] `/admin/social` — CRUD with icon picker, display order, visibility toggle
- [x] `/admin/messages` — Table with expandable rows, read/unread toggle, delete

### Infra
- [x] `ConditionalNavbar` — hides public navbar on `/admin` routes
- [x] `supabase-auth.ts` — browser client with persistent auth sessions
- [x] `suppressHydrationWarning` on `<html>` tag (fixes ISS-004)
- [x] Shared `admin-pages.module.css` design system

## Active Blockers
- None.
