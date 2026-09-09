# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.17.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" tailwindcss="plugins:none" sveltekit-adapter="adapter:vercel" --install pnpm exam-tracker
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
# Exam Tracker

## Authentication setup

Authentication uses Better Auth with MongoDB. Copy `.env.example` to `.env` and set:

- `MONGODB_URI`: your MongoDB connection string
- `MONGODB_DATABASE`: database name (defaults to `exam-tracker`)
- `MONGODB_DNS_SERVERS`: comma-separated DNS servers for MongoDB SRV lookups (defaults to `8.8.8.8`)
- `BETTER_AUTH_SECRET`: a long random secret used to sign sessions
- `BETTER_AUTH_URL`: the app's public URL
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: credentials from a GitHub OAuth App

For a GitHub OAuth App, set the callback URL to `http://localhost:5173/api/auth/callback/github` during local development. In production use `https://your-domain.example/api/auth/callback/github` and set `BETTER_AUTH_URL` to that same origin. Run `pnpm dev`, then open `/auth` to sign in. Better Auth stores users, accounts, sessions, and verification tokens in MongoDB through its adapter.
