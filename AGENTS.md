<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project Structure Rules

## Backend
- All server-side pages live in: /src/app/**
- API routes live in: /src/app/api/**

## Frontend
- Frontend gallery entry: /src/app/frontend/page.jsx
- Protected by environment variable: ENABLE_FRONTEND_GALLERY
- If disabled -> return 404 using notFound()

- Each frontend page must follow:
	/src/app/frontend/{page-name}/{page-name}.jsx
    /src/app/frontend/{page-name}/page.jsx

## Components
- Reusable components must be placed in:
	/src/lib/components/{component-name}/{component-name}.jsx

## Frontend Pages Registration
- All frontend pages must be registered in:
	/src/app/frontend/frontend-pages.js
- Do NOT hardcode page lists inside components

## Environment Rules
- ENABLE_FRONTEND_GALLERY controls visibility of the frontend gallery
- This must only be checked on the server side

## General Rules
- Use App Router conventions
- Use functional React components
- Keep code minimal and readable
- Avoid unnecessary dependencies
<!-- END:nextjs-agent-rules -->
