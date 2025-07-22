# Developer Guide

This repository contains a mini-CRM built with **Next.js 15** and **React 19**.  
UI components rely on **Ant Design 5** and styles are written using SCSS modules.
The application authenticates against a **Directus** instance and uses
**@tanstack/react-query** for all data fetching.

## Project layout

- `src/app` – Next.js route groups and pages. The `'(protected)'` folder is
  wrapped by `ProtectedLayout` which redirects unauthenticated users to
  `/login`.
- `src/components` – Reusable React components. Each component has a matching
  `*.module.scss` file.
- `src/hooks` – Custom React Query hooks (`useContributions`,
  `useCreateContribution`, `useOrganizations`, ...).
- `src/lib` – Utilities such as `auth-context.tsx` and `directus.ts`.
- `models` – Auto generated Directus schema types.
- `public` – Static assets (logos, images).

## Coding conventions

- All source files use **TypeScript**.
- Components that use React state or hooks must include `"use client"` at the
  top so they run on the client side.
- Import styles from SCSS modules and keep file names in the form
  `ComponentName.module.scss`.
- Use the `@/` alias (configured in `tsconfig.json`) to reference files inside
  `src/`.
- Fetch data using the `directus` client together with React Query. New fetching
  logic should be implemented as a custom hook in `src/hooks`.
- Keep commit messages short and in English.

## Development workflow

1. Install dependencies with `npm install` (requires Node 18+).
2. Start the dev server with `npm run dev`.
3. Before committing, run `npm run lint` and ensure there are no ESLint errors.
4. There are no automated tests yet.

The `NEXT_PUBLIC_DIRECTUS_URL` environment variable must point to your Directus
API endpoint for the application to authenticate correctly.
