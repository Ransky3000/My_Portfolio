# Backend Setup

This folder contains the backend infrastructure configuration for the My_Portfolio project.
The backend relies on Supabase for the database, authentication (optional), and storage.

## Environment Variables

The Frontend agent will need to add the following to their `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key
```

## Table Schemas

### `projects`
Stores the portfolio projects.
* `id` (UUID, Primary Key)
* `title` (TEXT)
* `description` (TEXT)
* `long_description` (TEXT, optional)
* `tech_stack` (TEXT ARRAY)
* `category` (TEXT)
* `image_url` (TEXT, optional)
* `live_url` (TEXT, optional)
* `github_url` (TEXT, optional)
* `featured` (BOOLEAN)
* `display_order` (INT)
* `created_at` (TIMESTAMPTZ)
* `updated_at` (TIMESTAMPTZ)

**Access Level**: Anyone can read (`SELECT`), only admins can insert/update/delete.

### `contact_submissions`
Stores messages submitted from the contact form.
* `id` (UUID, Primary Key)
* `name` (TEXT)
* `email` (TEXT)
* `message` (TEXT)
* `read` (BOOLEAN)
* `created_at` (TIMESTAMPTZ)

**Access Level**: Anyone can insert (`INSERT`), no one can read without the admin dashboard.

## API Endpoints

### `POST /api/contact`
Handles the contact form submission.

**Payload:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello!"
}
```

**Responses:**
* `200 OK`: `{ "success": true, "message": "Message sent successfully" }`
* `400 Bad Request`: `{ "error": "Validation error", "details": [...] }`
* `500 Internal Server Error`: `{ "error": "Failed to submit contact form" }`

## Viewing Contact Submissions
To view the contact submissions, log in to the Supabase dashboard for the project, navigate to the Table Editor, and select the `contact_submissions` table.
