# Zelvyn / FitSync Monorepo

FitSync is an AI-powered fitness tracking and workout planning platform built as a modular monorepo.

## Project Structure

```
Zelvyn/
├── apps/
│   ├── web/                    # Frontend (React 18 + Vite + Tailwind + Redux Toolkit)
│   │   ├── src/
│   │   │   ├── components/     # UI & Feature components
│   │   │   ├── pages/          # Application views & routes
│   │   │   ├── layouts/        # AppLayout, TopHeader, BottomNav, etc.
│   │   │   ├── hooks/          # Custom & Redux hooks (useAppDispatch, useAppSelector)
│   │   │   ├── services/       # Firebase, OpenAI, and API services
│   │   │   ├── store/          # Redux Toolkit store & slices
│   │   │   ├── types/          # Frontend types
│   │   │   └── utils/          # Tailwind cn utility & helpers
│   │   ├── public/             # Static assets & PWA manifest icons
│   │   ├── index.html          # HTML Entry
│   │   ├── package.json        # @fitsync/web dependencies
│   │   ├── vite.config.ts      # Vite configuration & path aliases
│   │   └── tsconfig.json       # Web TypeScript configuration
│   │
│   └── api/                    # Backend (Node.js + Express + Mongoose + MongoDB)
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/       # Auth controller & routes
│       │   │   ├── users/      # User model, controller & routes
│       │   │   ├── workouts/   # Workout model, controller, seed & routes
│       │   │   └── logs/       # Workout completion logs & analytics
│       │   ├── middleware/     # Error handling & 404 catch-all
│       │   ├── config/         # Environment variable loader
│       │   ├── database/       # Mongoose connection & status
│       │   ├── common/         # Standardized API response helpers
│       │   ├── app.ts          # Express application setup
│       │   └── server.ts       # Server boot & graceful shutdown
│       ├── package.json        # @fitsync/api dependencies
│       └── tsconfig.json       # API TypeScript configuration
│
├── packages/                   # Shared workspaces
│   ├── types/                  # Shared TypeScript models (User, Workout, Logs, etc.)
│   ├── eslint-config/          # Shared ESLint configuration presets
│   └── tsconfig/               # Shared TypeScript base configuration
│
├── .env.example                # Unified environment variables template
├── .env                        # Local environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Monorepo workspaces manifest & scripts
├── pnpm-workspace.yaml         # pnpm workspace definition
└── README.md
```

---

## Quick Start

### 1. Install Dependencies
```bash
# With npm (workspaces)
npm install

# Or with pnpm
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Servers
```bash
# Start Frontend Web App (http://localhost:5173)
npm run dev:web

# Start Backend API Server (http://localhost:5000)
npm run dev:api
```

### 4. Build Production Bundles
```bash
# Build both web and api
npm run build

# Or individually
npm run build:web
npm run build:api
```

### 5. Lint
```bash
npm run lint:web
npm run lint:api
```
