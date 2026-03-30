<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# AGENTS.md

## Project: OJS Clone (Phase 1 MVP)

This document defines the strict architecture, schema, and structure.
All AI agents must follow this exactly.

---

# 1. Scope (Phase 1 ONLY)

We are building a minimal Open Journal System MVP.

Included:

* Authentication
* Single journal
* Submission system
* Simple review system
* Author & Reviewer dashboards

Excluded:

* Multi-journal
* Volume / Issue
* CMS pages
* Payments
* Notifications
* Advanced workflow

---

# 2. Tech Stack

* Next.js (App Router, /app directory)
* TypeScript
* Prisma ORM
* PostgreSQL (Supabase)
* TailwindCSS

---

# 3. Roles

Enum:

* ADMIN
* AUTHOR
* REVIEWER

---

# 4. Submission Workflow (Phase 1)

Status enum:

* SUBMITTED
* UNDER_REVIEW
* ACCEPTED
* REJECTED

Flow:

SUBMITTED → UNDER_REVIEW → ACCEPTED | REJECTED

---

# 5. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  ADMIN
  AUTHOR
  REVIEWER
}

enum SubmissionStatus {
  SUBMITTED
  UNDER_REVIEW
  ACCEPTED
  REJECTED
}

enum ReviewDecision {
  ACCEPT
  REJECT
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role
  createdAt DateTime @default(now())

  submissions Submission[]
  reviews     Review[]
}

model Submission {
  id        String   @id @default(uuid())
  title     String
  abstract  String
  fileUrl   String
  status    SubmissionStatus @default(SUBMITTED)
  authorId  String
  createdAt DateTime @default(now())

  author User @relation(fields: [authorId], references: [id])
  reviews Review[]
}

model Review {
  id           String   @id @default(uuid())
  submissionId String
  reviewerId   String
  decision     ReviewDecision
  comment      String
  createdAt    DateTime @default(now())

  submission Submission @relation(fields: [submissionId], references: [id])
  reviewer   User @relation(fields: [reviewerId], references: [id])
}
```

---

# 6. Folder Structure (STRICT)

```text
/app
  /login
    page.tsx
  /register
    page.tsx

  /dashboard
    /author
      page.tsx
    /reviewer
      page.tsx

  /submissions
    /new
      page.tsx
    /[id]
      page.tsx

  page.tsx (home)

 /components
   Form.tsx
   Input.tsx
   Button.tsx
   SubmissionCard.tsx

 /lib
   prisma.ts
   auth.ts

 /actions
   auth.ts
   submission.ts
   review.ts
```

---

# 7. Core Features

## Auth

* Register user
* Login user
* Store session (simple implementation allowed)

## Submission

* Author can:

  * Create submission
  * View own submissions

## Review

* Admin assigns reviewer (can be hardcoded for MVP)
* Reviewer can:

  * View assigned submissions
  * Submit review

---

# 8. Rules for Agents

* DO NOT change schema
* DO NOT add new tables
* DO NOT introduce new roles
* DO NOT implement features outside scope
* Prefer simplicity over scalability
* Use Server Actions for mutations
* Keep UI minimal

---

# 9. Definition of Done (Phase 1)

✔ User can register & login
✔ Author can submit paper
✔ Reviewer can review paper
✔ Submission status updates
✔ Basic dashboards work

---

# END

<!-- END:nextjs-agent-rules -->
