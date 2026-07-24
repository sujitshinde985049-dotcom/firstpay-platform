begin;

create or replace function public.has_permission(requested_organisation_id uuid, requested_permission text)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_super_admin() or (
    public.is_organisation_member(requested_organisation_id) and exists (
      select 1
      from public.organisation_members member
      join public.organisation_member_roles member_role
        on member_role.member_id = member.id and member_role.organisation_id = member.organisation_id
      join public.organisation_role_permissions role_permission
        on role_permission.role_id = member_role.role_id and role_permission.organisation_id = member.organisation_id
      join public.organisation_permissions permission
        on permission.id = role_permission.permission_id and permission.organisation_id = member.organisation_id
      where member.organisation_id = requested_organisation_id
        and member.user_id = auth.uid()
        and permission.code = requested_permission
    )
  );
$$;
revoke all on function public.has_permission(uuid, text) from public;
grant execute on function public.has_permission(uuid, text) to authenticated;

create or replace function public.seed_operational_permissions(target_organisation_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into public.organisation_permissions (organisation_id, code, description)
  values
    (target_organisation_id, 'customers.read', 'View customers'),
    (target_organisation_id, 'customers.manage', 'Manage customers'),
    (target_organisation_id, 'mandates.read', 'View mandates'),
    (target_organisation_id, 'mandates.manage', 'Manage mandates'),
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
  on conflict (organisation_id, code) do nothing;

  insert into public.organisation_role_permissions (organisation_id, role_id, permission_id)
  select target_organisation_id, role.id, permission.id
  from public.organisation_roles role
  join public.organisation_permissions permission
    on permission.organisation_id = role.organisation_id
  where role.organisation_id = target_organisation_id
    and permission.code in (
      'customers.read','customers.manage','mandates.read','mandates.manage',
      'payments.read','payments.manage','settlements.read','settlements.manage',
      'reports.read','reports.export','webhooks.read','webhooks.manage',
      'documents.read','documents.manage'
    )
    and (
      role.name = 'Admin'
      or (role.name = 'Manager' and permission.code not in ('webhooks.manage'))
      or (role.name = 'Sales' and permission.code in ('customers.read','customers.manage','mandates.read','payments.read','reports.read'))
      or (role.name = 'Support' and permission.code in ('customers.read','customers.manage','mandates.read','mandates.manage','payments.read','webhooks.read'))
      or (role.name = 'Finance' and permission.code in ('customers.read','mandates.read','payments.read','payments.manage','settlements.read','settlements.manage','reports.read','reports.export'))
      or (role.name = 'Developer' and permission.code in ('customers.read','mandates.read','payments.read','webhooks.read','webhooks.manage','documents.read','documents.manage'))
      or (role.name = 'Viewer' and permission.code like '%.read')
    )
  on conflict (organisation_id, role_id, permission_id) do nothing;
end;
$$;
revoke all on function public.seed_operational_permissions(uuid) from public;

create or replace function public.seed_operational_permissions_on_organisation()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform public.seed_operational_permissions(new.id);
  return new;
end;
$$;

do $$ declare organisation_record record; begin
  for organisation_record in select id from public.organisations loop
    perform public.seed_operational_permissions(organisation_record.id);
  end loop;
end $$;

drop trigger if exists seed_operational_permissions_after_organisation on public.organisations;
create trigger seed_operational_permissions_after_organisation
after insert on public.organisations for each row
execute function public.seed_operational_permissions_on_organisation();

do $$
declare policy_record record;
begin
  for policy_record in
    select * from (values
      ('customers','customers.read','customers.manage'),
      ('mandates','mandates.read','mandates.manage'),
      ('payments','payments.read','payments.manage'),
      ('settlements','settlements.read','settlements.manage'),
      ('webhook_endpoints','webhooks.read','webhooks.manage'),
      ('webhook_deliveries','webhooks.read','webhooks.manage'),
      ('api_credentials','developer.read','developer.manage'),
      ('document_folders','documents.read','documents.manage'),
      ('organisation_documents','documents.read','documents.manage'),
      ('departments','members.read','members.manage')
    ) as policies(table_name, read_permission, manage_permission)
  loop
    execute format('drop policy if exists %I on public.%I', policy_record.table_name || '_tenant_access', policy_record.table_name);
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.has_permission(organisation_id, %L))',
      policy_record.table_name || '_tenant_read', policy_record.table_name, policy_record.read_permission
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.has_permission(organisation_id, %L))',
      policy_record.table_name || '_tenant_insert', policy_record.table_name, policy_record.manage_permission
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.has_permission(organisation_id, %L)) with check (public.has_permission(organisation_id, %L))',
      policy_record.table_name || '_tenant_update', policy_record.table_name, policy_record.manage_permission, policy_record.manage_permission
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.has_permission(organisation_id, %L))',
      policy_record.table_name || '_tenant_delete', policy_record.table_name, policy_record.manage_permission
    );
  end loop;
end $$;

drop policy if exists notifications_tenant_access on public.notifications;
drop policy if exists notifications_user_scope on public.notifications;
create policy notifications_user_read on public.notifications for select to authenticated
using (public.is_super_admin() or (public.is_organisation_member(organisation_id) and (user_id is null or user_id = auth.uid())));
create policy notifications_user_update on public.notifications for update to authenticated
using (public.is_organisation_member(organisation_id) and user_id = auth.uid())
with check (public.is_organisation_member(organisation_id) and user_id = auth.uid());
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;

drop policy if exists organisation_documents_storage_select on storage.objects;
drop policy if exists organisation_documents_storage_insert on storage.objects;
drop policy if exists organisation_documents_storage_delete on storage.objects;
create policy organisation_documents_storage_select on storage.objects for select to authenticated
using (bucket_id = 'organisation-documents' and public.has_permission(public.storage_organisation_id(name), 'documents.read'));
create policy organisation_documents_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'organisation-documents' and public.has_permission(public.storage_organisation_id(name), 'documents.manage'));
create policy organisation_documents_storage_delete on storage.objects for delete to authenticated
using (bucket_id = 'organisation-documents' and public.has_permission(public.storage_organisation_id(name), 'documents.manage'));

alter table public.customers add constraint customers_id_organisation_unique unique (id, organisation_id);
alter table public.mandates add constraint mandates_id_organisation_unique unique (id, organisation_id);
alter table public.webhook_endpoints add constraint webhook_endpoints_id_organisation_unique unique (id, organisation_id);
alter table public.document_folders add constraint document_folders_id_organisation_unique unique (id, organisation_id);
alter table public.departments add constraint departments_id_organisation_unique unique (id, organisation_id);
alter table public.mandates add constraint mandates_customer_tenant_fk foreign key (customer_id, organisation_id) references public.customers(id, organisation_id);
alter table public.payments add constraint payments_customer_tenant_fk foreign key (customer_id, organisation_id) references public.customers(id, organisation_id);
alter table public.payments add constraint payments_mandate_tenant_fk foreign key (mandate_id, organisation_id) references public.mandates(id, organisation_id);
alter table public.webhook_deliveries add constraint webhook_deliveries_endpoint_tenant_fk foreign key (endpoint_id, organisation_id) references public.webhook_endpoints(id, organisation_id);
alter table public.document_folders add constraint document_folders_parent_tenant_fk foreign key (parent_id, organisation_id) references public.document_folders(id, organisation_id);
alter table public.organisation_documents add constraint organisation_documents_folder_tenant_fk foreign key (folder_id, organisation_id) references public.document_folders(id, organisation_id);
alter table public.organisation_members add constraint organisation_members_department_tenant_fk foreign key (department_id, organisation_id) references public.departments(id, organisation_id);

commit;
