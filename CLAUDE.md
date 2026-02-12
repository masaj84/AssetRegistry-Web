# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint
```

## Architecture

React 19 + TypeScript SPA with Vite 7 and Tailwind CSS 4.

### Project Structure

```
src/
├── components/
│   ├── layout/AppLayout.tsx     # App layout (sidebar + topbar)
│   ├── ui/                      # Button, Card, Input, Select, Badge, ThemeToggle
│   ├── ContactSection.tsx       # Contact form + newsletter
│   └── ProtectedRoute.tsx       # Auth route guard
├── context/
│   ├── AuthContext.tsx           # JWT auth (login, register, refresh tokens)
│   ├── LanguageContext.tsx       # EN/PL translations
│   └── ThemeContext.tsx          # Light/dark theme
├── pages/
│   ├── LandingPage.tsx          # Landing page (TEASER_MODE from env)
│   ├── auth/                    # LoginPage, RegisterPage
│   └── app/                     # DashboardPage, AssetsPage, AssetFormPage, ReportsPage
├── types/index.ts               # TypeScript types (Asset, User, etc.)
├── lib/utils.ts                 # Helpers (cn, formatCurrency, formatDate)
├── App.tsx                      # Routing
└── index.css                    # Tailwind theme (@theme)
```

### Routing

- `/` — Landing page (public)
- `/login`, `/register` — Auth pages
- `/app` — Dashboard (protected)
- `/app/assets` — Asset list with filters
- `/app/assets/new`, `/app/assets/:id` — Asset form
- `/app/reports` — Reports
- `/whitepaper` — Whitepaper page

### Key Patterns

- **TEASER_MODE**: Controlled by `VITE_TEASER_MODE` env variable. `true` = landing page only (coming soon), `false` = full app with login/dashboard.
- **Translations**: `useLanguage()` hook, `t('key')` function. All strings in `LanguageContext.tsx`.
- **Theme**: `useTheme()` hook, persisted in localStorage. Tailwind v4 uses `@theme` in CSS.
- **Auth**: JWT + refresh tokens via `AuthContext`. API calls to backend `/api/auth/*`.

## Deployment

### Environments

| | Staging | Production |
|---|---|---|
| **URL** | http://63.182.249.47 | https://trve.io |
| **TEASER_MODE** | `false` (full app) | `true` (landing page) |
| **Deploy path** | `/var/www/trve-staging` | `/var/www/trve-production` |
| **API proxy** | → localhost:5001 | → localhost:5000 |

### CI/CD

**Workflow:** `.github/workflows/deploy-frontend.yml`

Deploy via GitHub Actions UI: Actions → "Deploy TRVE Frontend to EC2" → choose `staging` or `production`.

### Env Variables (Vite)

| Variable | Purpose |
|----------|---------|
| VITE_API_URL | Backend API URL |
| VITE_TEASER_MODE | `true` = landing page only, `false` = full app |

### Design

- Inspired by Palantir Warpspeed
- Colors: orange/magenta/purple gradients (dark mode), minimalist (light mode)
- Dark/light toggle
- Tailwind CSS 4 with `@theme` in `index.css`
