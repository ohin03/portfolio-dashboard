# Portfolio Analytics Dashboard

A customizable, client-side portfolio analytics dashboard built with Next.js, React, Tailwind CSS, Recharts, Zustand, and dnd-kit. The UI demonstrates performance, risk, allocation, and activity insights with illustrative demo data.

**Important:** This dashboard does **not** use live market data or a backend. Values shown in widgets are sample/demo inputs for UI demonstration only. They are not investment advice or real portfolio figures.

## Features

- **14 analytics widgets** covering portfolio, performance, risk, and activity views
- **Widget customization:** show/hide widgets, drag-and-drop reorder, and reset layout to defaults
- **Dark / light theme** and **white-label branding** (brand name, primary color, accent color)
- **Browser localStorage persistence** for layout and theme/branding preferences
- **Storybook** for shared dashboard components
- **Vitest** unit tests and **Playwright** end-to-end / accessibility checks

## Widgets

All 14 widget types are implemented and available in Customize:

| Widget | Category | Description |
|--------|----------|-------------|
| Portfolio Summary | Portfolio | Total portfolio value and key metrics |
| Portfolio Performance | Performance | Performance over time (chart) |
| Asset Allocation | Portfolio | Allocation by sector |
| Risk Analysis | Risk | Portfolio risk indicators |
| Market Status | Activity | Market indicators and account activity |
| Top Holdings | Portfolio | Largest holdings |
| Recent Transactions | Activity | Recent portfolio transactions |
| Sector Exposure | Portfolio | Exposure across market sectors |
| Benchmark Comparison | Performance | Portfolio vs benchmarks |
| Dividend Income | Performance | Dividend income over time |
| Drawdown Analysis | Risk | Declines from previous peaks (chart) |
| Risk Metrics | Risk | Risk-adjusted returns and related metrics |
| Correlation Matrix | Risk | Correlations between assets |
| Brinson Performance Attribution | Performance | Allocation, selection, and interaction effects vs a benchmark |

## Customization and persistence

Open **Customize** in the dashboard header to:

1. Toggle widget visibility
2. Review the full widget catalog
3. Reset layout to the default set and order (**Reset Layout**)
4. Set theme (dark / light), brand name, and brand colors

On the main grid, use each widget’s drag handle to reorder. Visibility and order are saved in this browser under the localStorage key `portfolio-analytics-dashboard-layout`. Theme and branding are saved under `portfolio-theme-settings`. Clearing site data for this origin resets those preferences.

There is no server sync, export, or multi-device persistence.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Zustand (with `persist`)
- `@dnd-kit` (sortable layout)
- Storybook 8
- Vitest
- Playwright (+ `@axe-core/playwright` for accessibility)

## Requirements

- Node.js (compatible with Next.js 14)
- npm

No application environment variables are required for local development or a standard production build.

## Installation and local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next.js ESLint |
| `npm run test` | Run Vitest unit tests once |
| `npm run test:e2e` | Run Playwright E2E tests (starts/reuses the dev server per Playwright config) |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build a static Storybook site |

## Testing and quality checks

### Unit tests

```bash
npm run test
```

Vitest covers Brinson performance attribution logic under `src/lib/analytics/`.

### End-to-end tests

```bash
npm run test:e2e
```

Playwright tests live in `e2e/` and cover dashboard load/controls, the 14 widgets in settings, mobile horizontal overflow, and WCAG 2.1 A/AA checks via axe. By default the config starts `npm run dev` at `http://127.0.0.1:3000` (or reuses an existing server when not in CI).

Install Playwright browsers once if needed:

```bash
npx playwright install
```

### TypeScript

```bash
npx tsc --noEmit
```

### Production build

```bash
npm run build
npm run start
```

## Storybook

```bash
npm run storybook
```

Storybook runs at [http://localhost:6006](http://localhost:6006) and includes stories for the dashboard overview and shared components (StatCard, WidgetShell, SortableWidget, PerformanceChart, DrawdownChart).

Static build:

```bash
npm run build-storybook
```

Output is written to `storybook-static/` (gitignored for local use). Serve that folder with any static file host if you want a published component catalog.

## Production deployment notes

1. Run `npm run build` and deploy the Next.js app with a Node host that supports `next start`, or use a platform that builds Next.js App Router apps (for example Vercel).
2. No required `.env` file is defined by this project for the current demo dashboard.
3. The app is client-side with localStorage; each user’s layout and theme stay in their browser.
4. Demo data remains illustrative after deployment—there is still no live market feed or API backend.
5. Optionally build and host Storybook separately with `npm run build-storybook`.
6. For CI, prefer `npm run test`, `npx tsc --noEmit`, `npm run test:e2e` (with browsers installed), and `npm run build` before release.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for host-specific details.
