# Backend Agent — Status

**Role:** Server-side logic, Database schema, API routes, Supabase config.
**Last Updated:** 2026-05-13

## Current State
**Status:** 💤 Idle
**Git Branch:** `main` (Hotfix)
**Supabase Project ID:** `hhmtviclhwwffoyktdgf`

## M5a.1 Task: Schema Migration — `featured` → `visibility`

**Priority:** 🔴 Immediate — Frontend is waiting on this for the dropdown UI.

Replace the `featured` boolean column on the `projects` table with a `visibility` text column that supports 3 states: `hidden`, `visible`, `featured`.

**Run this migration via `apply_migration`:**
```sql
-- Step 1: Add new visibility column
ALTER TABLE projects ADD COLUMN visibility text NOT NULL DEFAULT 'visible';

-- Step 2: Migrate existing data
UPDATE projects SET visibility = CASE WHEN featured = true THEN 'featured' ELSE 'visible' END;

-- Step 3: Drop old column
ALTER TABLE projects DROP COLUMN featured;

-- Step 4: Add constraint
ALTER TABLE projects ADD CONSTRAINT projects_visibility_check 
  CHECK (visibility IN ('hidden', 'visible', 'featured'));
```

**After completing:**
1. Verify the migration worked: `SELECT id, title, visibility FROM projects;`
2. Update this file: set Status to `💤 Idle` and mark the task as complete.

## Completed Work
- [x] M5a: Tables, Auth, Storage, RLS
- [x] Bug 1 Fix: Added `projects_auth_select` RLS policy
- [x] M5a.1: Schema migration — replaced `featured` (boolean) with `visibility` (text: hidden/visible/featured)
