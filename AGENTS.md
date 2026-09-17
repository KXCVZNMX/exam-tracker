# Repository Guidelines

## Project overview

Exam Tracker is a SvelteKit application for recording subjects, practice exams, section marks, and study comments. It uses Svelte 5 runes, TypeScript, Tailwind CSS 4 with DaisyUI, MongoDB, and Better Auth. The Vercel adapter is configured for production builds.

## Repository structure

- `src/routes`: SvelteKit pages and server actions. The `(main)` route group contains authenticated pages; `/subjects/[subjectId]` contains exam data and its `comments` editor.
- `src/lib/components`: reusable Svelte UI and modal forms.
- `src/lib/server`: server-only database and authentication modules. Do not import these modules into browser code.
- `src/lib/types`: shared domain types for subjects, exams, and comments.
- `src/lib/util`: shared utilities and their unit tests, including Markdown and KaTeX rendering.
- `src/lib/assets` and `static`: images, fonts, icons, and other static assets.
- `.env.example`: the development environment variable template.

SvelteKit generates `.svelte-kit`; it is build output and should not be edited or committed.

## Development commands

Use the pinned `pnpm` package manager (`pnpm@12.4.1`).

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start the Vite development server.
- `pnpm dev -- --open`: start the server and open it in a browser.
- `pnpm check`: run SvelteKit synchronization and strict `svelte-check`.
- `pnpm lint`: check Prettier formatting and run ESLint.
- `pnpm format`: format the repository with Prettier.
- `pnpm test`: run Vitest once (server and headless Chromium projects).
- `pnpm test:unit`: run Vitest in watch mode.
- `pnpm build`: create the production Vercel build.
- `pnpm beforePush`: run lint, type checks, and the production build.

Run `pnpm beforePush` before opening a pull request when the change touches application code, routes, or configuration.

## Coding conventions

- Keep TypeScript strict and preserve the existing Svelte 5 runes style (`$state`, `$derived`, and `$props`).
- Use tabs, single quotes, semicolons, and a 100-character print width; let Prettier enforce formatting.
- Use `$lib` aliases for imports from `src/lib`. Keep server-only imports under `src/lib/server` and in `*.server.ts` modules.
- Name Svelte components in PascalCase. Follow SvelteKit conventions for `+page.svelte`, `+page.server.ts`, and route folders.
- Use typed form actions and validate all user input at the server boundary. Preserve ownership checks using the authenticated `userId` when reading or mutating MongoDB documents.
- Escape or sanitize rendered user content. Markdown changes must retain the existing HTML escaping, DOMPurify sanitization, and KaTeX behavior.

## Tests

Tests live beside the code they cover and use `*.spec.ts`, `*.test.ts`, or the corresponding `.svelte.*` suffix. Server tests run in Node; Svelte component tests run in the headless Chromium project configured in `vite.config.ts`. Add focused tests for changed utilities or data transformations and run the smallest relevant test command, followed by `pnpm beforePush` for broader changes.

## Configuration and security

Copy `.env.example` to `.env` for local development. Keep secrets and OAuth credentials out of Git. Required server configuration includes `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`; MongoDB database and DNS resolver settings have development defaults. GitHub and Google OAuth credentials are read by `src/lib/auth.ts`. When changing authentication or database code, verify both authorization checks and production build behavior.

## Git and pull requests

Use short imperative Conventional Commit-style subjects such as `feat(auth): add provider` or `fix(comments): preserve draft`. Pull requests should describe the user-visible behavior, list validation commands, and include screenshots for UI changes.
