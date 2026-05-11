# API Contracts

**Purpose:** Defines the exact data structures passed between Backend and Frontend.

## 1. Database Schema: `public.projects`
Fetched directly via Supabase client by Frontend (`Projects.tsx`).

| Column | Type | Description |
|:---|:---|:---|
| `id` | `uuid` | Primary Key |
| `title` | `text` | Project name |
| `description` | `text` | Short summary |
| `problem` | `text` (nullable) | The problem the project solves |
| `solution` | `text` (nullable) | How the project solves the problem |
| `tech_stack` | `text[]` | Array of strings (e.g., `["React", "Next.js"]`) |
| `category` | `text` | Filter category (e.g., `embedded`, `web`) |
| `image_url` | `text` (nullable) | Path to image (e.g., `/images/isrc.png`) |
| `live_url` | `text` (nullable) | External link |
| `github_url` | `text` (nullable) | Source code link |
| `featured` | `boolean` | If true, highlight on UI |
| `display_order` | `integer` | Ascending sort order |

## 2. API Route: `POST /api/contact`
Handled internally by Next.js Route Handler, saves to `public.contact_submissions`.

**Request Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Error Response (400 Bad Request - Validation):**
```json
{
  "error": "Validation error",
  "details": [{ "path": ["email"], "message": "Invalid email" }]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```
