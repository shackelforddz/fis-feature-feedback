# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Feature Feedback — project notes

- Standalone iPad kiosk that collects feedback for the feature-showcase categories.
- Shares the Supabase database with `/Users/davidshackelford/Documents/feature-showcase` (writes to `survey_responses` and `feedback`).
- Canonical viewport: iPad (portrait + landscape, responsive).
- Dark mode is forced (`<html className="dark">`) — do not add a light theme.
- Large touch targets: nav buttons ≥ h-16, option cards ≥ 88px. Keep parity in new UI.
- Wizard pacing: **one question per screen** (matches the feature-showcase wizard).
- All form content lives in `src/content/` (one file per category) and the category list in `src/lib/form-config.ts`. Edit there, not in components.
- Required fields per the spec in `feedback-forms.md`: every wizard answer + name + company. Next is disabled until the current screen is valid.
- Submission writes one row to `survey_responses` and one row to `feedback` for each question with `goesToBoard: true` (currently only `wishlist`).
- Kiosk mode: after submit, the Thanks screen auto-resets after 60s back to the splash.
- **Supabase permissions**: `feedback` and `survey_responses` inserts are performed server-side using the **service role key** (matching the feature-showcase setup). Do not switch to the anon key.
