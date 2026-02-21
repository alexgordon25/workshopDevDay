# Todo App

A full-stack Todo application with authentication built with the [T3 Stack](https://create.t3.gg/).

## Features

- **Authentication** — Register and sign in with email and password (powered by Better Auth)
- **Todo Management** — Create todos with a title and optional description
- **Status Tracking** — Move todos through three statuses: `PENDING` → `IN PROGRESS` → `DONE`
- **Data Isolation** — Each user only sees their own todos
- **BDD Documentation** — Full Behavior-Driven Development docs in `docs/bdd/`

## Tech Stack

- [Next.js 15](https://nextjs.org) — React framework with App Router
- [Better Auth](https://www.better-auth.com) — Authentication (email/password)
- [Drizzle ORM](https://orm.drizzle.team) — Type-safe ORM with SQLite
- [tRPC](https://trpc.io) — End-to-end typesafe APIs
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling
- [React Query](https://tanstack.com/query) — Server state management

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable             | Description                              |
|----------------------|------------------------------------------|
| `BETTER_AUTH_SECRET` | Random secret string for auth signing    |
| `DATABASE_URL`       | SQLite file path (e.g. `file:./db.sqlite`) |

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── sign-in/          # Sign-in page
│   ├── sign-up/          # Sign-up / registration page
│   ├── todos/            # Protected todo list page
│   └── _components/      # Shared UI components
│       ├── create-todo-form.tsx
│       ├── todo-list.tsx
│       └── todo-item.tsx
├── server/
│   ├── api/routers/      # tRPC routers (post, todo)
│   ├── better-auth/      # Auth config and helpers
│   └── db/               # Drizzle schema and client
└── trpc/                 # tRPC client setup
```

## Database Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run db:push` | Push schema changes to the database |
| `npm run db:generate` | Generate migration files        |
| `npm run db:migrate`  | Run pending migrations          |
| `npm run db:studio`   | Open Drizzle Studio (DB GUI)    |

## BDD Documentation

This project was built following a **Behavior-Driven Development (BDD)** approach.
Learning resources are available in `docs/bdd/`:

| File | Content |
|------|---------|
| `00-what-is-bdd.md` | Introduction to BDD and Gherkin syntax |
| `01-user-stories.md` | All user stories written in Gherkin |
| `02-gherkin-to-code.md` | How each scenario maps to actual code |
| `03-bdd-workflow.md` | The full BDD workflow used in this project |
