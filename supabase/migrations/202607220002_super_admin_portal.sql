begin;

alter table public.organisations
  add column if not exists subscription_plan_id uuid references public.subscription_plans(id) on delete set null,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists branding jsonb not null default '{}'::jsonb,
  add column if not exists deleted_at timestamptz;

alter table public.profiles
  add column if not exists deactivated_at timestamptz,
  add column if not exists deleted_at timestamptz;

grant update (deactivated_at, deleted_at) on public.profiles to authenticated;
create policy profiles_update_super_admin on public.profiles for update to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());

alter table public.subscription_plans
  add column if not exists slug text,
  add column if not exists limits jsonb not null default '{}'::jsonb,
  add column if not exists sort_order integer not null default 0;

create unique index if not exists subscription_plans_slug_idx on public.subscription_plans(slug);
create index if not exists organisations_plan_idx on public.organisations(subscription_plan_id) where deleted_at is null;
create index if not exists organisations_status_idx on public.organisations(status, created_at desc) where deleted_at is null;
create index if not exists profiles_active_idx on public.profiles(created_at desc) where deleted_at is null and deactivated_at is null;

create table public.organisation_invitations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  email text not null,
  role_name text not null default 'Admin',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  invited_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, email, status)
);

create table public.api_usage_daily (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  usage_date date not null,
  request_count bigint not null default 0 check (request_count >= 0),
  error_count bigint not null default 0 check (error_count >= 0),
  webhook_count bigint not null default 0 check (webhook_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, usage_date)
);

create table public.storage_usage_daily (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  usage_date date not null,
  bytes_used bigint not null default 0 check (bytes_used >= 0),
  object_count bigint not null default 0 check (object_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, usage_date)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete set null,
  company_name text not null,
  contact_name text,
  email text not null,
  phone text,
  source text,
  status text not null default 'new' check (status in ('new', 'qualified', 'proposal', 'won', 'lost')),
  owner_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete set null,
  requester_id uuid references public.profiles(id) on delete set null,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'pending', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  deleted_at timestamptz
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  audience text not null default 'all' check (audience in ('all', 'platform', 'organisation')),
  organisation_id uuid references public.organisations(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'expired')),
  publish_at timestamptz,
  expire_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.media_folders(id) on delete cascade,
  name text not null,
  path text not null unique,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  storage_path text not null unique,
  name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  alt_text text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.cms_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('homepage', 'hero', 'statistic', 'footer', 'navigation', 'faq', 'testimonial', 'partner', 'client_logo', 'blog', 'legal', 'seo')),
  slug text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (entry_type, slug)
);

create index organisation_invitations_email_idx on public.organisation_invitations(lower(email), status);
create index api_usage_daily_date_idx on public.api_usage_daily(usage_date desc, organisation_id);
create index storage_usage_daily_date_idx on public.storage_usage_daily(usage_date desc, organisation_id);
create index leads_status_idx on public.leads(status, created_at desc) where deleted_at is null;
create index support_tickets_status_idx on public.support_tickets(status, priority, created_at desc) where deleted_at is null;
create index audit_events_created_idx on public.audit_events(created_at desc);
create index audit_events_actor_idx on public.audit_events(actor_id, created_at desc);
create index audit_events_organisation_idx on public.audit_events(organisation_id, created_at desc);
create index announcements_status_idx on public.announcements(status, publish_at);
create index media_assets_folder_idx on public.media_assets(folder_id, created_at desc) where deleted_at is null;
create index cms_entries_type_idx on public.cms_entries(entry_type, status, sort_order) where deleted_at is null;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'organisation_invitations', 'api_usage_daily', 'storage_usage_daily', 'leads',
    'support_tickets', 'audit_events', 'announcements', 'media_folders', 'media_assets', 'cms_entries'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('alter table public.%I force row level security', table_name);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin())', table_name || '_super_admin', table_name);
  end loop;
end $$;

create policy announcements_tenant_read on public.announcements for select to authenticated using (
  status = 'published'
  and (publish_at is null or publish_at <= now())
  and (expire_at is null or expire_at > now())
  and (audience = 'all' or (audience = 'organisation' and public.is_organisation_member(organisation_id)))
);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'organisation_invitations', 'api_usage_daily', 'storage_usage_daily', 'leads',
    'support_tickets', 'announcements', 'media_folders', 'media_assets', 'cms_entries'
  ] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

insert into public.subscription_plans (name, slug, description, price_monthly, price_yearly, currency, limits, sort_order)
values
  ('Starter', 'starter', 'For teams launching recurring payments', 4999, 49990, 'INR', '{"users":5,"storage_gb":5,"api_requests":100000,"webhooks":2,"reports":3,"priority_support":false}'::jsonb, 10),
  ('Growth', 'growth', 'For growing payment operations', 14999, 149990, 'INR', '{"users":15,"storage_gb":25,"api_requests":500000,"webhooks":10,"reports":10,"priority_support":false}'::jsonb, 20),
  ('Business', 'business', 'For established multi-team businesses', 39999, 399990, 'INR', '{"users":50,"storage_gb":100,"api_requests":2000000,"webhooks":50,"reports":50,"priority_support":true}'::jsonb, 30),
  ('Enterprise', 'enterprise', 'For high-scale regulated businesses', 99999, 999990, 'INR', '{"users":250,"storage_gb":500,"api_requests":10000000,"webhooks":250,"reports":-1,"priority_support":true}'::jsonb, 40),
  ('Custom', 'custom', 'Tailored commercial and platform limits', 0, 0, 'INR', '{"users":-1,"storage_gb":-1,"api_requests":-1,"webhooks":-1,"reports":-1,"priority_support":true}'::jsonb, 50)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  limits = excluded.limits,
  sort_order = excluded.sort_order;

insert into public.platform_settings (key, value, is_public)
values
  ('company', '{"name":"FirstPay","support_email":"support@firstpay.in","sales_email":"enterprise@firstpay.in","phone":"","address":""}'::jsonb, true),
  ('integrations', '{"smtp_host":"","smtp_port":"","google_analytics_id":"","tag_manager_id":""}'::jsonb, false),
  ('appearance', '{"theme":"system","logo_path":"","favicon_path":""}'::jsonb, true),
  ('maintenance', '{"enabled":false,"message":"Scheduled maintenance in progress"}'::jsonb, true)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('platform-media', 'platform-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif','application/pdf'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy platform_media_select on storage.objects for select using (bucket_id = 'platform-media');
create policy platform_media_insert on storage.objects for insert to authenticated with check (bucket_id = 'platform-media' and public.is_super_admin());
create policy platform_media_update on storage.objects for update to authenticated using (bucket_id = 'platform-media' and public.is_super_admin()) with check (bucket_id = 'platform-media' and public.is_super_admin());
create policy platform_media_delete on storage.objects for delete to authenticated using (bucket_id = 'platform-media' and public.is_super_admin());

commit;
