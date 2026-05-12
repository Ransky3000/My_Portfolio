# Backend Agent — Status

**Role:** Server-side logic, Database schema, API routes, Supabase config.
**Last Updated:** 2026-05-12

## Current State
**Status:** 💤 Idle
**Git Branch:** `feature/backend-admin`
**Supabase Project ID:** `hhmtviclhwwffoyktdgf`

## QA Feedback / Bugs (Assigned to Backend)

**Bug 1 (CRITICAL): Authenticated users cannot SELECT from `projects` table.**
- **Status:** ✅ FIXED
- **Fix Applied:** Added `projects_auth_select` policy for authenticated SELECT.
- **Audit Result:** All other tables (`site_settings`, `social_links`, `contact_submissions`) already had correct SELECT policies for their intended roles. No additional fixes needed.

## Completed Work (M5a)

### Task 1: Database Schema
- [x] Create `site_settings` table
- [x] Create `social_links` table

### Task 2: Supabase Auth Setup
- [x] Email/Password auth provider enabled
- [x] Owner account created via dashboard
- [x] Documented in `docs/knowledge/api-contracts.md`

### Task 3: Supabase Storage Setup
- [x] Created public storage bucket `portfolio-images`
- [x] Set storage policies
- [x] Documented

### Task 4: Row Level Security (RLS)
- [x] `site_settings`: public SELECT, authenticated INSERT/UPDATE/DELETE
- [x] `social_links`: public SELECT, authenticated INSERT/UPDATE/DELETE
- [x] `projects`: public SELECT + authenticated SELECT/INSERT/UPDATE/DELETE ✅ FIXED
- [x] `contact_submissions`: public INSERT, authenticated SELECT/UPDATE/DELETE

### Task 5: Seed Data
- [x] Seeded `site_settings`
- [x] Seeded `social_links`
- [x] Updated `backend/supabase/seed.sql`

### Task 6: Documentation
- [x] Updated `docs/knowledge/api-contracts.md`

## Active Blockers
- None. Fix is straightforward.
