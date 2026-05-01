-- Feature Feedback shares the feature-showcase Supabase project.
-- These tables already exist there; this file documents the expected schema
-- and is safe to re-run (all statements are idempotent).

create extension if not exists "pgcrypto";

create table if not exists public.feedback (
  id             uuid primary key default gen_random_uuid(),
  category_id    text        not null,
  quote          text        not null check (length(quote) between 1 and 500),
  name           text        not null check (length(name) between 1 and 80),
  company        text        not null check (length(company) between 1 and 80),
  question_key   text,
  submission_id  uuid,
  approved       boolean     not null default true,
  created_at     timestamptz not null default now()
);

alter table public.feedback
  add column if not exists question_key text;
alter table public.feedback
  add column if not exists submission_id uuid;

create index if not exists feedback_category_created_idx
  on public.feedback (category_id, created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "feedback_read_approved" on public.feedback;
create policy "feedback_read_approved"
  on public.feedback for select
  using (approved = true);

-- Inserts run server-side via the service role key, so no anon insert policy.

create table if not exists public.survey_responses (
  id             uuid primary key default gen_random_uuid(),
  category_id    text        not null,
  name           text        not null check (length(name) between 1 and 80),
  company        text        not null check (length(company) between 1 and 80),
  answers        jsonb       not null,
  created_at     timestamptz not null default now()
);

create index if not exists survey_responses_category_created_idx
  on public.survey_responses (category_id, created_at desc);

alter table public.survey_responses enable row level security;
-- Survey data is private; only the server role can read.
