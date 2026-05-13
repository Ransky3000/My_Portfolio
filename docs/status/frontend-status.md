# Frontend Agent — Status

**Role:** UI/UX, Next.js components, Framer Motion, CSS styling.
**Last Updated:** 2026-05-13

## Current State
**Status:** 🔄 Active (M5a.1 — Minor CSS Fix)
**Current Branch:** `main`

## QA Feedback

**Bug 6: Visibility dropdown has white background.**
- **Status:** ✅ FIXED

**Bug 7: Category dropdown has white background.**
- **Issue:** The `<select>` dropdown for Category in the project edit form also has a white background, same as Bug 6.
- **Fix Required:** Apply the same dark-theme styling to the `.fieldSelect` class in `admin-pages.module.css` (and its `option` children).

**Feature: Dynamic Categories (replace hardcoded list)**
- **Issue:** The `CATEGORIES` array in `/admin/projects/page.tsx` is hardcoded: `['iot', 'automation', 'web', 'research', 'open-source', 'embedded']`. If the Director adds a new category (e.g., "machine-learning"), it won't appear as an option.
- **Fix Required:**
  1. **Admin edit form:** Replace the hardcoded `<select>` with a combo-box approach — a text `<input>` with a `<datalist>` populated from `SELECT DISTINCT category FROM projects`. This lets the user pick an existing category OR type a brand new one.
  2. **Public site filter buttons (`Projects.tsx`):** Replace the hardcoded `categories` array with a dynamic query: fetch distinct categories from Supabase and render filter buttons from the result. Always include "All" as the first option.

**Feature: Social Links — Same UX as Projects table**
- **Issue:** The `/admin/social` table still uses manual ORDER numbers and a Yes/No VISIBLE toggle. It should match the Projects table UX.
- **Fix Required:**
  1. **Drag-and-drop reordering:** Same as Projects — use `@dnd-kit` (already installed). Replace the ORDER column with a GripVertical drag handle. On drag-end, persist new `display_order` values to Supabase.
  2. **Visibility dropdown:** Replace the Yes/No badge with a `<select>` dropdown with two options: `Visible` (maps to `visible = true`) and `Hidden` (maps to `visible = false`). Auto-save on change. Use the same dark-themed styling as the Projects visibility dropdown.
  3. **Remove the ORDER column** from the table header and rows.

## M5a.1 Tasks

### Task 1: Drag-and-Drop Project Reordering ✅ DONE
- Installed `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- Replaced manual "Order" column with a GripVertical drag handle.
- On drag-end, optimistically reorders locally and persists `display_order` to Supabase.

### Task 2: Auto-Dismiss Notification Bar ✅ DONE
- Added `useEffect` with 3s `setTimeout` to all 4 admin pages (projects, settings, social, messages).
- Added CSS `fadeInOut` animation for a smooth slide-in/fade-out transition.

### Task 3: Visibility Dropdown ✅ DONE
- Replaced `featured: boolean` with `visibility: 'hidden' | 'visible' | 'featured'` in admin and public interfaces.
- Admin projects table now shows an inline `<select>` dropdown with auto-save on change.
- Public `Projects.tsx` filters hidden projects via `.neq('visibility', 'hidden')`.
- Added `.badgeBlue` and `.visibilitySelect` CSS classes.

### Task 4: Site Title Caching Fix ✅ DONE (previous hotfix)
- Moved `site_title` fetch from Server Component to Client Component.

## Completed Work (M5a)
- [x] Dynamic Hero & Footer
- [x] Full Admin Panel CRUD
- [x] Admin CMS link in Navbar
- [x] Next.js image config fixes

## Active Blockers
- None.
