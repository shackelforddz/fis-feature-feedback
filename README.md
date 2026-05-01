# Feature Feedback

Standalone iPad kiosk wizard for collecting feedback on the four FIS feature
categories: Portfolio Insights, Risk Mitigation, Loan Evaluation Center, and
Visual Scenario Analysis. Modeled on `cls-feedback`, points at the
`feature-showcase` Supabase database.

- Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · Supabase · Zod
- Canonical viewport: iPad (portrait + landscape, responsive)
- Dark mode only, large touch targets
- Flow: splash → category → 6 questions (one per screen) → name + company → thanks → 60s auto-reset

## Setup

```bash
npm install
cp .env.local.example .env.local   # then paste the feature-showcase Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase

Reuses the `feature-showcase` Supabase project. Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side inserts use this)

The `survey_responses` and `feedback` tables already exist in that project.
For reference, the schema is in `supabase/migrations/0001_initial.sql`.

### What the submit action writes

For each submission:

1. One row into `public.survey_responses` with the full answer payload.
2. One row into `public.feedback` for every question marked
   `goesToBoard: true` in the question config (currently just the wishlist
   answer). These appear on the `feature-showcase` feedback wall.

## Project layout

```
src/
  app/
    actions.ts              # submitFeedback server action (writes both tables)
    layout.tsx              # dark-mode shell
    page.tsx                # renders <Wizard />
    globals.css
  components/
    wizard/
      wizard.tsx            # screen state machine + layout
      question-renderer.tsx # renders one question by type
    ui/                     # shadcn primitives (button / input / textarea)
  content/
    portfolio-questions.ts
    risk-questions.ts
    loan-evaluation-questions.ts
    scenario-analysis-questions.ts
  lib/
    form-config.ts          # category list + per-category question lookup
    submission-schema.ts    # zod validator
    types.ts
    utils.ts
    supabase/server.ts      # service-role client
supabase/
  migrations/0001_initial.sql
```

Edit form copy in `src/content/<category>-questions.ts`. Categories are
defined in `src/lib/form-config.ts`.
# fis-feature-feedback
