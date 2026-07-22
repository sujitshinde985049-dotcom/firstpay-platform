begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_super_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'suspended', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('invited', 'active', 'suspended')),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, user_id),
  unique (id, organisation_id)
);

create table public.organisation_roles (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  description text,
  is_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, name),
  unique (id, organisation_id)
);

create table public.organisation_permissions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  code text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, code),
  unique (id, organisation_id)
);

create table public.organisation_role_permissions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  role_id uuid not null,
  permission_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, role_id, permission_id),
  foreign key (role_id, organisation_id) references public.organisation_roles(id, organisation_id) on delete cascade,
  foreign key (permission_id, organisation_id) references public.organisation_permissions(id, organisation_id) on delete cascade
);

create table public.organisation_member_roles (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  member_id uuid not null,
  role_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, member_id, role_id),
  foreign key (member_id, organisation_id) references public.organisation_members(id, organisation_id) on delete cascade,
  foreign key (role_id, organisation_id) references public.organisation_roles(id, organisation_id) on delete cascade
);

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  price_monthly numeric(12, 2) not null default 0 check (price_monthly >= 0),
  price_yearly numeric(12, 2) not null default 0 check (price_yearly >= 0),
  currency text not null default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.subscription_plans(id) on delete cascade,
  feature_key text not null,
  feature_value jsonb not null default 'true'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, feature_key)
);

create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  key text not null,
  enabled boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index feature_flags_scope_key_idx on public.feature_flags (coalesce(organisation_id, '00000000-0000-0000-0000-000000000000'::uuid), key);
create index organisation_members_user_idx on public.organisation_members(user_id, status);
create index organisation_members_organisation_idx on public.organisation_members(organisation_id, status);
create index organisation_roles_organisation_idx on public.organisation_roles(organisation_id);
create index organisation_permissions_organisation_idx on public.organisation_permissions(organisation_id);
create index organisation_role_permissions_role_idx on public.organisation_role_permissions(role_id);
create index organisation_role_permissions_permission_idx on public.organisation_role_permissions(permission_id);
create index organisation_member_roles_member_idx on public.organisation_member_roles(member_id);
create index organisation_member_roles_role_idx on public.organisation_member_roles(role_id);
create index plan_features_plan_idx on public.plan_features(plan_id);
create index feature_flags_organisation_idx on public.feature_flags(organisation_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.bootstrap_organisation_access()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.organisation_roles (organisation_id, name, description)
  values
    (new.id, 'Admin', 'Full organisation administration'),
    (new.id, 'Manager', 'Operational management'),
    (new.id, 'Sales', 'Sales operations'),
    (new.id, 'Support', 'Customer support operations'),
    (new.id, 'Finance', 'Billing and finance operations'),
    (new.id, 'Developer', 'Technical integrations'),
    (new.id, 'Viewer', 'Read-only access');

  insert into public.organisation_permissions (organisation_id, code, description)
  values
    (new.id, 'organisation.read', 'View organisation settings'),
    (new.id, 'organisation.update', 'Update organisation settings'),
    (new.id, 'members.read', 'View organisation members'),
    (new.id, 'members.manage', 'Manage organisation members'),
    (new.id, 'roles.read', 'View roles and permissions'),
    (new.id, 'roles.manage', 'Manage roles and permissions'),
    (new.id, 'billing.read', 'View billing data'),
    (new.id, 'billing.manage', 'Manage billing data'),
    (new.id, 'sales.read', 'View sales data'),
    (new.id, 'sales.manage', 'Manage sales data'),
    (new.id, 'support.read', 'View support data'),
    (new.id, 'support.manage', 'Manage support data'),
    (new.id, 'developer.read', 'View developer settings'),
    (new.id, 'developer.manage', 'Manage developer settings');

  insert into public.organisation_role_permissions (organisation_id, role_id, permission_id)
  select new.id, role.id, permission.id
  from public.organisation_roles role
  cross join public.organisation_permissions permission
  where role.organisation_id = new.id
    and permission.organisation_id = new.id
    and (
      role.name = 'Admin'
      or (role.name = 'Manager' and permission.code not in ('billing.manage', 'roles.manage', 'developer.manage'))
      or (role.name = 'Sales' and permission.code in ('organisation.read', 'sales.read', 'sales.manage'))
      or (role.name = 'Support' and permission.code in ('organisation.read', 'support.read', 'support.manage'))
      or (role.name = 'Finance' and permission.code in ('organisation.read', 'billing.read', 'billing.manage'))
      or (role.name = 'Developer' and permission.code in ('organisation.read', 'developer.read', 'developer.manage'))
      or (role.name = 'Viewer' and permission.code like '%.read')
    );
  return new;
end;
$$;

create trigger on_organisation_created after insert on public.organisations
for each row execute function public.bootstrap_organisation_access();

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select is_super_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_organisation_member(requested_organisation_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organisation_members
    where organisation_id = requested_organisation_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.has_permission(requested_organisation_id uuid, requested_permission text)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_super_admin() or exists (
    select 1
    from public.organisation_members member
    join public.organisation_member_roles member_role on member_role.member_id = member.id and member_role.organisation_id = member.organisation_id
    join public.organisation_role_permissions role_permission on role_permission.role_id = member_role.role_id and role_permission.organisation_id = member.organisation_id
    join public.organisation_permissions permission on permission.id = role_permission.permission_id and permission.organisation_id = member.organisation_id
    where member.organisation_id = requested_organisation_id
      and member.user_id = auth.uid()
      and member.status = 'active'
      and permission.code = requested_permission
  );
$$;

create or replace function public.storage_organisation_id(object_name text)
returns uuid language plpgsql immutable set search_path = '' as $$
begin
  return ((storage.foldername(object_name))[1])::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

revoke all on function public.is_super_admin() from public;
revoke all on function public.is_organisation_member(uuid) from public;
revoke all on function public.has_permission(uuid, text) from public;
revoke all on function public.storage_organisation_id(text) from public;
grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.is_organisation_member(uuid) to authenticated;
grant execute on function public.has_permission(uuid, text) to authenticated;
grant execute on function public.storage_organisation_id(text) to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles', 'organisations', 'organisation_members', 'organisation_roles',
    'organisation_permissions', 'organisation_role_permissions', 'organisation_member_roles',
    'subscription_plans', 'plan_features', 'feature_flags', 'platform_settings'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('alter table public.%I force row level security', table_name);
  end loop;
end $$;

create policy profiles_select on public.profiles for select to authenticated using (
  id = auth.uid() or public.is_super_admin() or exists (
    select 1 from public.organisation_members mine
    join public.organisation_members theirs on theirs.organisation_id = mine.organisation_id
    where mine.user_id = auth.uid() and mine.status = 'active' and theirs.user_id = profiles.id and theirs.status = 'active'
  )
);
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

create policy organisations_select on public.organisations for select to authenticated using (public.is_super_admin() or public.is_organisation_member(id));
create policy organisations_insert on public.organisations for insert to authenticated with check (public.is_super_admin());
create policy organisations_update on public.organisations for update to authenticated using (public.is_super_admin() or public.has_permission(id, 'organisation.update')) with check (public.is_super_admin() or public.has_permission(id, 'organisation.update'));
create policy organisations_delete on public.organisations for delete to authenticated using (public.is_super_admin());

create policy members_select on public.organisation_members for select to authenticated using (public.is_super_admin() or public.is_organisation_member(organisation_id));
create policy members_insert on public.organisation_members for insert to authenticated with check (public.is_super_admin() or public.has_permission(organisation_id, 'members.manage'));
create policy members_update on public.organisation_members for update to authenticated using (public.is_super_admin() or public.has_permission(organisation_id, 'members.manage')) with check (public.is_super_admin() or public.has_permission(organisation_id, 'members.manage'));
create policy members_delete on public.organisation_members for delete to authenticated using (public.is_super_admin() or public.has_permission(organisation_id, 'members.manage'));

create policy roles_select on public.organisation_roles for select to authenticated using (public.is_super_admin() or public.is_organisation_member(organisation_id));
create policy roles_manage on public.organisation_roles for all to authenticated using (public.is_super_admin() or public.has_permission(organisation_id, 'roles.manage')) with check (public.is_super_admin() or public.has_permission(organisation_id, 'roles.manage'));
create policy permissions_select on public.organisation_permissions for select to authenticated using (public.is_super_admin() or public.is_organisation_member(organisation_id));
create policy permissions_manage on public.organisation_permissions for all to authenticated using (public.is_super_admin() or public.has_permission(organisation_id, 'roles.manage')) with check (public.is_super_admin() or public.has_permission(organisation_id, 'roles.manage'));
create policy role_permissions_select on public.organisation_role_permissions for select to authenticated using (public.is_super_admin() or public.is_organisation_member(organisation_id));
create policy role_permissions_manage on public.organisation_role_permissions for all to authenticated using (public.is_super_admin() or public.has_permission(organisation_id, 'roles.manage')) with check (public.is_super_admin() or public.has_permission(organisation_id, 'roles.manage'));
create policy member_roles_select on public.organisation_member_roles for select to authenticated using (public.is_super_admin() or public.is_organisation_member(organisation_id));
create policy member_roles_manage on public.organisation_member_roles for all to authenticated using (public.is_super_admin() or public.has_permission(organisation_id, 'members.manage')) with check (public.is_super_admin() or public.has_permission(organisation_id, 'members.manage'));

create policy plans_select on public.subscription_plans for select to authenticated using (is_active or public.is_super_admin());
create policy plans_manage on public.subscription_plans for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy plan_features_select on public.plan_features for select to authenticated using (exists (select 1 from public.subscription_plans plan where plan.id = plan_id and (plan.is_active or public.is_super_admin())));
create policy plan_features_manage on public.plan_features for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy feature_flags_select on public.feature_flags for select to authenticated using (public.is_super_admin() or organisation_id is null or public.is_organisation_member(organisation_id));
create policy feature_flags_manage on public.feature_flags for all to authenticated using (public.is_super_admin() or (organisation_id is not null and public.has_permission(organisation_id, 'organisation.update'))) with check (public.is_super_admin() or (organisation_id is not null and public.has_permission(organisation_id, 'organisation.update')));
create policy platform_settings_select on public.platform_settings for select to authenticated using (is_public or public.is_super_admin());
create policy platform_settings_manage on public.platform_settings for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles', 'organisations', 'organisation_members', 'organisation_roles',
    'organisation_permissions', 'organisation_role_permissions', 'organisation_member_roles',
    'subscription_plans', 'plan_features', 'feature_flags', 'platform_settings'
  ] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('organisation-files', 'organisation-files', false)
on conflict (id) do nothing;

create policy organisation_files_select on storage.objects for select to authenticated using (
  bucket_id = 'organisation-files' and public.is_organisation_member(public.storage_organisation_id(name))
);
create policy organisation_files_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'organisation-files' and public.has_permission(public.storage_organisation_id(name), 'developer.manage')
);
create policy organisation_files_update on storage.objects for update to authenticated using (
  bucket_id = 'organisation-files' and public.has_permission(public.storage_organisation_id(name), 'developer.manage')
) with check (
  bucket_id = 'organisation-files' and public.has_permission(public.storage_organisation_id(name), 'developer.manage')
);
create policy organisation_files_delete on storage.objects for delete to authenticated using (
  bucket_id = 'organisation-files' and public.has_permission(public.storage_organisation_id(name), 'developer.manage')
);

commit;
