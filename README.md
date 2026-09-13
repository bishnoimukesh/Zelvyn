# FitSync — AI-Powered Smart Fitness Tracker

FitSync is a mobile-first, AI-powered fitness tracking and workout planning application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **ShadCN UI**, **Redux Toolkit**, **React Router**, **Firebase**, and **Vite PWA**.

The design system and layout patterns are inspired by the [FitSync Design Reference](https://spring-object-54897598.figma.site/?utm_source=chatgpt.com), featuring an athletic obsidian and electric volt neon visual language (`#08080A`, `#111115`, `#C8FF47`, `Barlow Condensed`, `Inter`, `JetBrains Mono`).

---

## Step 1: Initial Project Setup Foundation

Completed foundational setup tasks:
- **React + TypeScript + Vite**: Fast modern dev server and optimized production bundler.
- **Tailwind CSS & Design Tokens**: Configured with FitSync color palette, typography (`Barlow Condensed`, `Inter`, `JetBrains Mono`), and custom card hover/glow utilities.
- **ShadCN UI**: Initial foundational components (`Button`, `Card`, `Input`, `Badge`, `Progress`).
- **React Router**: App layout with mobile bottom navigation bar and route placeholders (`/`, `/dashboard`, `/workouts`, `/workouts/:id`, `/planner`, `/progress`, `/videos`, `/coach`, `/profile`).
- **Redux Toolkit**: Centralized store with scalable slices (`auth`, `user`, `workouts`, `planner`, `progress`, `ui`).
- **Firebase SDK**: Initialized client (`src/services/firebase/config.ts`) with `.env.example`.
- **AI Service Architecture**: Service module prepared in `src/services/ai/openai.ts`.
- **Vite PWA Plugin**: Configured with web app manifest and offline caching readiness.
- **Code Quality**: ESLint 9 flat config and Prettier formatting.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```

### 5. Run Linter
```bash
npm run lint
```
