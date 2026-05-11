# 🧠 Knowledge Base

**Purpose:** A shared memory bank for the agent team to avoid repeating mistakes.
**Rule:** Keep entries concise. The Planner will regularly prune this file to optimize token usage.

## Current Learnings

### KB-001: Next.js + Framer Motion (Frontend)
- **Date:** 2026-05-10
- **Context:** Implementing animations in Next.js App Router.
- **Lesson:** Framer Motion components (`motion.div`) require the `"use client"` directive at the top of the file, as they rely on client-side React APIs.

### KB-002: Zod Server-Side Validation (Backend)
- **Date:** 2026-05-10
- **Context:** Processing contact form submissions.
- **Lesson:** Use `schema.safeParse()` instead of `.parse()` in API routes to gracefully handle validation errors and return a custom `400 Bad Request` response instead of throwing a generic 500 error.

### KB-003: LF vs CRLF Line Endings (Git)
- **Date:** 2026-05-10
- **Context:** Committing code on Windows.
- **Lesson:** Windows uses CRLF, Git converts to LF. Ignore the `LF will be replaced by CRLF` warnings during `git add`; it is standard behavior.
