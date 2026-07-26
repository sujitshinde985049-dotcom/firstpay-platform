create or replace function public.seed_operational_permissions(target_organisation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.organisation_permissions (organisation_id, code, description)
  values
    (target_organisation_id, 'customers.read', 'View customers'),
    (target_organisation_id, 'customers.manage', 'Manage customers'),
    (target_organisation_id, 'mandates.read', 'View mandates'),
    (target_organisation_id, 'mandates.view', 'View mandates'),
    (target_organisation_id, 'mandates.manage', 'Manage mandates'),
    (target_organisation_id, 'mandates.create', 'Create mandates'),
    (target_organisation_id, 'mandates.update', 'Update mandates'),
    (target_organisation_id, 'mandates.cancel', 'Cancel mandates'),
    (target_organisation_id, 'payments.read', 'View payments'),
    (target_organisation_id, 'payments.manage', 'Manage payments'),
    (target_organisation_id, 'settlements.read', 'View settlements'),
    (target_organisation_id, 'settlements.manage', 'Manage settlements'),
    (target_organisation_id, 'reports.read', 'View reports'),
    (target_organisation_id, 'reports.export', 'Export reports'),
    (target_organisation_id, 'webhooks.read', 'View webhooks'),
    (target_organisation_id, 'webhooks.manage', 'Manage webhooks'),
    (target_organisation_id, 'documents.read', 'View documents'),
    (target_organisation_id, 'documents.manage', 'Manage documents')
  on conflict (organisation_id, code)
  do update set description = excluded.description;

  insert into public.organisation_role_permissions
    (organisation_id, role_id, permission_id)
  select target_organisation_id, role.id, permission.id
  from public.organisation_roles role
  join public.organisation_permissions permission
    on permission.organisation_id = role.organisation_id
  where role.organisation_id = target_organisation_id
    and (
      role.name = 'Admin'
      or (
        role.name = 'Manager'
        and permission.code in (
          'customers.read', 'customers.manage', 'mandates.read',
          'payments.read', 'payments.manage', 'settlements.read',
          'settlements.manage', 'reports.read', 'reports.export',
          'webhooks.read', 'documents.read', 'documents.manage'
        )
      )
      or (
        role.name = 'Sales'
        and permission.code in (
          'customers.read', 'customers.manage', 'mandates.read',
          'payments.read', 'reports.read'
        )
      )
      or (
        role.name = 'Support'
        and permission.code in (
          'customers.read', 'customers.manage', 'mandates.read',
          'mandates.manage', 'payments.read', 'webhooks.read'
        )
      )
      or (
        role.name = 'Finance'
        and permission.code in (
          'customers.read', 'mandates.read', 'payments.read',
          'payments.manage', 'settlements.read', 'settlements.manage',
          'reports.read', 'reports.export'
        )
      )
      or (
        role.name = 'Developer'
        and permission.code in (
          'customers.read', 'mandates.read', 'payments.read',
          'webhooks.read', 'webhooks.manage', 'documents.read',
          'documents.manage'
        )
      )
      or (
        role.name = 'Viewer'
        and (
          permission.code like '%.read'
          or permission.code = 'mandates.view'
        )
      )
    )
  on conflict (organisation_id, role_id, permission_id) do nothing;
end;
$$;

revoke all on function public.seed_operational_permissions(uuid) from public;

do $$
declare
  organisation_record record;
begin
  for organisation_record in select id from public.organisations loop
    perform public.seed_operational_permissions(organisation_record.id);
  end loop;
end;
$$;
