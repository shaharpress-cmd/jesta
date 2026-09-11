-- Persist terms acceptance from «כמעט שם» onboarding.
-- Safe to re-run.

alter table public.profiles
  add column if not exists terms_accepted_at timestamptz;

comment on column public.profiles.terms_accepted_at is
  'Set when the user accepts terms during post-OAuth onboarding';
