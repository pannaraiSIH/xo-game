# XO Game

## Features

- **Google OAuth login** — authenticated with Google OAuth 2.0 and an HTTP-only JWT cookie
- **Tic-Tac-Toe gameplay** — play against a random-move bot
- **Scoring system** — score and win streak are managed by the backend
- **3-win streak bonus** — the third consecutive win awards an additional point and resets the stored streak
- **Admin scores page** — paginated view of all users' scores at `/scores`
- **Role-based access** — admin-only API access enforced by NestJS guards and frontend route protection

## Tech Stack

- **Frontend:** Next.js, React, Zustand, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Drizzle ORM, PostgreSQL
- **Authentication:** Google OAuth 2.0 with Passport, JWT
- **Infrastructure:** Docker Compose

## Project Structure

```text
/api   NestJS API
/web   Next.js frontend
```

## Prerequisites

- Node.js
- pnpm
- Docker
- Google OAuth credentials

## Getting Started

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Install dependencies

Backend:

```bash
cd api
pnpm install
```

Frontend:

```bash
cd web
pnpm install
```

### 3. Configure environment variables

Backend:

```bash
cp api/.env.example api/.env
```

Frontend:

```bash
cp web/.env.example web/.env.local
```

Update the environment variables with your Google OAuth credentials and local configuration.

### 4. Run database migrations

```bash
cd api
pnpm db:migrate
```

### 5. Start the backend

```bash
cd api
pnpm start:dev
```

### 6. Start the frontend

```bash
cd web
pnpm dev
```

## Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8889`

## Game Rules

- Win: `+1`
- Loss: `-1`
- Score does not go below `0`
- Three consecutive wins award an additional `+1` bonus
- After receiving the streak bonus, the stored streak resets to `0`

## Admin Access

The admin role is assigned based on the configured admin email in the backend environment variables.

Admin users can access:

```text
/scores
```

to view the paginated user score list.
