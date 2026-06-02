# مخطط سبيكة للادخار بالذهب والفضة — Sabika Saving-Plan Tool

An Arabic (Egyptian), RTL, mobile-first guided tool that helps a user pick a
salary range, a monthly saving percentage, a goal, a duration, and a
gold/silver allocation, then shows an **estimated** monthly saving plan based
on today's reference price.

> This is **not** an investment-return calculator. It never promises profit,
> return, or guaranteed results. All figures are estimates based on the current
> reference price and are not financial advice.

## Tech stack

- **Vite + React 18 + TypeScript** (client-side SPA)
- **react-router-dom** for routing
- **Tailwind CSS** for styling (RTL via `dir="rtl"`, Cairo font)
- **Vitest** for unit tests (calculation/validation/formatting/price logic)

## Routes

- `/saving-plan` — the tool (page + hero + 5-step calculator + result)
- `/` and any unknown route redirect to `/saving-plan`

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite dev server            |
| `npm run build`     | Type-check then build for production  |
| `npm run preview`   | Preview the production build          |
| `npm run lint`      | Run ESLint                           |
| `npm run typecheck` | Type-check without emitting           |
| `npm run test`      | Run the Vitest unit tests            |

## Configuration

All configuration is optional and read from Vite env vars (`.env.local`).
See [`.env.example`](./.env.example).

### Prices

Prices are provided by a typed, validated reference provider
(`src/lib/priceProvider.ts`). Defaults are **editable reference values**, not
live data and not placeholders/zeros:

- `VITE_GOLD_PRICE_PER_GRAM` — EGP per gram, 24k gold basis
- `VITE_SILVER_PRICE_PER_GRAM` — EGP per gram
- `VITE_SILVER_PRICE_PER_OUNCE` — alternative; converted to per-gram (÷31.1034768)
- `VITE_PRICE_UPDATED_AT` — ISO timestamp shown as "آخر تحديث للسعر"

If a configured price value is present but invalid, the tool shows a graceful
"prices unavailable" state instead of fabricating numbers. A live price source
can be swapped in later behind the same `PriceResult` abstraction.

### CTA install link

The primary CTA points to a single constant (`src/lib/constants.ts`):

- `VITE_SABIKA_INSTALL_URL` — defaults to `https://sabika.go.link/eBoSi`

### Analytics

`src/lib/analytics.ts` is a no-op-safe wrapper. If a `window.dataLayer`
(GTM-style) is present, events are pushed to it; otherwise calls are silent
no-ops and never throw. Saving figures are bucketed, never sent raw.

## Project structure

```
src/
  App.tsx                         # router
  pages/SavingPlanPage.tsx        # /saving-plan page (hero + tool)
  components/
    ui/                           # Button, Card, SelectableOption, NumberField, Stepper
    saving-plan/                  # SavingPlanTool + 5 steps + ResultCards + PlanDisclaimer
  lib/
    savingPlanTypes.ts            # domain types
    savingPlanContent.ts          # Arabic copy + data maps
    savingPlanFormatting.ts       # safe number/currency/gram/ounce formatting
    savingPlanValidation.ts       # input validation + affordability
    savingPlanCalculator.ts       # pure plan calculation (safeDivide, calculateSavingPlan)
    priceProvider.ts              # typed config/env reference price provider
    analytics.ts                  # no-op-safe event tracking
    constants.ts                  # install URL
    __tests__/                    # Vitest unit tests
```
