-- Мэргэжил сонголтын цахим тест: серверийн өгөгдлийн сан
-- Серверийн SUPABASE_SECRET_KEY ашиглаж ажиллана. Нийтийн хөтөчид түлхүүр өгөхгүй.

create extension if not exists pgcrypto;

create table if not exists public.career_test_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_code text not null unique,
  idempotency_key uuid not null unique,
  full_name text not null,
  grade smallint not null check (grade between 9 and 12),
  group_name text not null,
  email text not null,
  phone text,
  consent boolean not null check (consent = true),
  consent_text_version text not null default '2026-11-24-v1',
  answers jsonb not null,
  results jsonb not null,
  assessment_version text not null,
  source_review_status text not null default 'corrected-transcription',
  review_status text not null default 'pending'
    check (review_status in ('pending','approved','rejected')),
  email_status text not null default 'not_sent'
    check (email_status in ('not_sent','waiting_report','sending','sent','failed')),
  review_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  report_storage_path text,
  report_sha256 text,
  resend_message_id text,
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists career_test_submissions_review_idx
  on public.career_test_submissions (review_status, created_at desc);
create index if not exists career_test_submissions_email_idx
  on public.career_test_submissions (email_status, updated_at desc);

create table if not exists public.career_admin_login_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  success boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists career_admin_login_attempts_ip_date_idx
  on public.career_admin_login_attempts (ip_hash, created_at desc);

alter table public.career_test_submissions enable row level security;
alter table public.career_admin_login_attempts enable row level security;

-- Нийтийн хэрэглэгч болон энгийн authenticated хэрэглэгчдэд шууд хандалт олгохгүй.
revoke all on table public.career_test_submissions from anon, authenticated;
revoke all on table public.career_admin_login_attempts from anon, authenticated;
grant all on table public.career_test_submissions to service_role;
grant all on table public.career_admin_login_attempts to service_role;

-- Тайланг private bucket-д хадгална. Нийтийн SELECT policy зориудаар үүсгээгүй.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('career-test-reports', 'career-test-reports', false, 10485760, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 10485760;

-- Автоматаар шинэчлэгддэг updated_at.
create or replace function public.set_career_submission_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_career_submission_updated_at on public.career_test_submissions;
create trigger trg_career_submission_updated_at
before update on public.career_test_submissions
for each row execute function public.set_career_submission_updated_at();
