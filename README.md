# Exam Tracker

Exam Tracker is a personal study companion for organizing subjects and tracking practice exams. Add section-by-section marks, record completion dates, and keep searchable Markdown notes for each exam. The app is designed for VCAA-style exams but accepts any company, year, and section structure.

## Features

- Sign in with GitHub or Google through Better Auth.
- Create, edit, and delete subjects with a configurable number of sections.
- Record practice exams, section scores, completion dates, and companies.
- Add, search, edit, preview, and delete Markdown comments for each exam.
- Render inline and display KaTeX math in comment previews.
- Keep every subject, exam, and comment scoped to the signed-in user.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) and Svelte 5 runes
- TypeScript with strict checking
- Tailwind CSS 4 and DaisyUI
- MongoDB with the Better Auth MongoDB adapter
- Vitest with Node and headless Chromium projects
- Vercel adapter for production deployment

## Requirements

- Node.js 22 or newer
- `pnpm` 12 (the repository pins `pnpm@12.4.1`)
- A MongoDB deployment
- OAuth applications for the providers you enable

## Local setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env
   ```

3. Fill in the values described below. `BETTER_AUTH_SECRET` should be a long random value. Do not commit `.env` or any credentials.

4. Start the development server:

   ```sh
   pnpm dev
   ```

5. Open <http://localhost:5173>. Unauthenticated users are sent to `/auth`; after signing in, the app returns to `/subjects`.

## Environment variables

| Variable                                    | Required           | Purpose                                                                     |
| ------------------------------------------- | ------------------ | --------------------------------------------------------------------------- |
| `MONGODB_URI`                               | Yes                | MongoDB connection string, including credentials when required.             |
| `MONGODB_DATABASE`                          | No                 | Database name; defaults to `exam-tracker`.                                  |
| `MONGODB_DNS_SERVERS`                       | No                 | Comma-separated DNS servers for MongoDB SRV lookups; defaults to `8.8.8.8`. |
| `BETTER_AUTH_SECRET`                        | Yes                | Secret used to sign Better Auth sessions.                                   |
| `BETTER_AUTH_URL`                           | Yes                | The app origin, such as `http://localhost:5173`.                            |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Provider-dependent | GitHub OAuth application credentials.                                       |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Provider-dependent | Google OAuth application credentials.                                       |

For local OAuth, configure these callback URLs in each provider:

```text
http://localhost:5173/api/auth/callback/github
http://localhost:5173/api/auth/callback/google
```

For production, replace the origin with the deployed `BETTER_AUTH_URL` origin. Better Auth stores users, accounts, sessions, and verification tokens in MongoDB.

## Commands

```sh
pnpm dev          # start the development server
pnpm check        # run svelte-check
pnpm lint         # Prettier check and ESLint
pnpm test         # run Vitest once
pnpm test:unit    # run Vitest in watch mode
pnpm build        # create a production build
pnpm preview      # preview the production build locally
pnpm format       # format source files
pnpm beforePush   # lint, check, and build
```

## Project layout

```text
src/
├── routes/
│   ├── +page.svelte                 landing page and sign-in entry point
│   ├── auth/                         OAuth sign-in page
│   └── (main)/subjects/              authenticated subject, exam, and comment pages
├── lib/components/                   reusable cards and modal forms
├── lib/server/                       Better Auth, MongoDB, and server actions
├── lib/types/                        subject, exam, and comment types
└── lib/util/                         Markdown rendering and shared utilities
```

## Deployment

The project uses `@sveltejs/adapter-vercel`. Deploy it to Vercel (or another supported SvelteKit target) with the production environment variables configured in the hosting provider. Set `BETTER_AUTH_URL` to the public HTTPS origin and update the OAuth callback URLs before testing sign-in.

## Contributing

Keep changes focused, follow the existing Prettier and ESLint configuration, and run `pnpm beforePush` before submitting a pull request. Add or update focused tests when changing shared utilities, validation, or data transformations. Include screenshots for visual changes.
