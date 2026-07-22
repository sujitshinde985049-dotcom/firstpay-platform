begin;

create table public.customers (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  company text not null, contact_name text not null, email text not null, phone text, status text not null default 'active' check (status in ('active','inactive','blocked')),
  tags text[] not null default '{}', notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz
);
create table public.mandates (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  customer_id uuid not null references public.customers(id), reference text not null, type text not null check (type in ('upi_autopay','e_nach')),
  status text not null default 'pending' check (status in ('pending','active','paused','cancelled','failed','expired')), frequency text not null,
  amount numeric(14,2) not null check (amount >= 0), starts_at timestamptz, ends_at timestamptz, metadata jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  customer_id uuid references public.customers(id), mandate_id uuid references public.mandates(id), reference text not null, amount numeric(14,2) not null,
  currency text not null default 'INR', status text not null default 'pending' check (status in ('pending','success','failed','refunded')),
  failure_reason text, paid_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.settlements (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  reference text not null, amount numeric(14,2) not null, fee numeric(14,2) not null default 0, tax numeric(14,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','processing','settled','failed')), bank_reference text, settled_at timestamptz,
  period_start date, period_end date, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.leads add column if not exists priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  add column if not exists notes text, add column if not exists deleted_at timestamptz;
create table public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  url text not null, description text, events text[] not null default '{}', status text not null default 'active' check (status in ('active','disabled')),
  secret_hash text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz
);
create table public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  endpoint_id uuid not null references public.webhook_endpoints(id), event_type text not null, status text not null check (status in ('pending','success','failed')),
  response_code integer, attempt_count integer not null default 0, request_summary jsonb not null default '{}', response_summary jsonb not null default '{}',
  next_retry_at timestamptz, delivered_at timestamptz, created_at timestamptz not null default now()
);
create table public.api_credentials (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null, key_prefix text not null, secret_hash text not null, scopes text[] not null default '{}', status text not null default 'active' check (status in ('active','revoked')),
  last_used_at timestamptz, expires_at timestamptz, created_by uuid references public.profiles(id), created_at timestamptz not null default now(), revoked_at timestamptz
);
create table public.document_folders (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  parent_id uuid references public.document_folders(id) on delete cascade, name text not null, created_by uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.organisation_documents (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete set null, name text not null, storage_path text not null unique, mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0), uploaded_by uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade, title text not null, body text not null, priority text not null default 'normal' check (priority in ('low','normal','high','critical')),
  link text, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.departments (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null, description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organisation_id,name)
);
alter table public.organisation_members add column if not exists department_id uuid references public.departments(id) on delete set null;
alter table public.organisations add column if not exists legal_profile jsonb not null default '{}', add column if not exists notification_preferences jsonb not null default '{}', add column if not exists integration_settings jsonb not null default '{}';

do $$ declare t text; begin foreach t in array array['customers','mandates','payments','settlements','webhook_endpoints','webhook_deliveries','api_credentials','document_folders','organisation_documents','notifications','departments'] loop
  execute format('alter table public.%I enable row level security',t); execute format('alter table public.%I force row level security',t);
  execute format('create policy %I on public.%I for all to authenticated using (public.is_organisation_member(organisation_id) or public.is_super_admin()) with check (public.is_organisation_member(organisation_id) or public.is_super_admin())',t||'_tenant_access',t);
end loop; end $$;
create policy notifications_user_scope on public.notifications for select to authenticated using (public.is_organisation_member(organisation_id) and (user_id is null or user_id = auth.uid()));
create index customers_org_status_idx on public.customers(organisation_id,status,created_at desc) where deleted_at is null;
create index customers_search_idx on public.customers(organisation_id,lower(company),lower(email));
create index mandates_org_status_idx on public.mandates(organisation_id,status,created_at desc);
create index payments_org_status_idx on public.payments(organisation_id,status,created_at desc);
create index settlements_org_status_idx on public.settlements(organisation_id,status,created_at desc);
create index webhook_deliveries_org_idx on public.webhook_deliveries(organisation_id,created_at desc);
create index notifications_user_idx on public.notifications(organisation_id,user_id,read_at,created_at desc);
create index organisation_documents_org_idx on public.organisation_documents(organisation_id,folder_id,created_at desc) where deleted_at is null;
do $$ declare t text; begin foreach t in array array['customers','mandates','payments','settlements','webhook_endpoints','document_folders','organisation_documents','departments'] loop execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',t,t); end loop; end $$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('organisation-documents','organisation-documents',false,26214400,array['application/pdf','image/jpeg','image/png','image/webp','text/csv','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']) on conflict(id) do nothing;
create policy organisation_documents_storage_select on storage.objects for select to authenticated using (bucket_id='organisation-documents' and public.is_organisation_member((storage.foldername(name))[1]::uuid));
create policy organisation_documents_storage_insert on storage.objects for insert to authenticated with check (bucket_id='organisation-documents' and public.is_organisation_member((storage.foldername(name))[1]::uuid));
create policy organisation_documents_storage_delete on storage.objects for delete to authenticated using (bucket_id='organisation-documents' and public.is_organisation_member((storage.foldername(name))[1]::uuid));
commit;
