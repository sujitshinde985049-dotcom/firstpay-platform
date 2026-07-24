begin;
create or replace function public.is_organisation_member(requested_organisation_id uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(
    select 1 from public.organisation_members member
    join public.organisations organisation on organisation.id=member.organisation_id
    join public.profiles profile on profile.id=member.user_id
    where member.organisation_id=requested_organisation_id and member.user_id=auth.uid()
      and member.status='active' and organisation.status='active' and organisation.deleted_at is null
      and profile.deactivated_at is null and profile.deleted_at is null
  );
$$;
revoke all on function public.is_organisation_member(uuid) from public;
grant execute on function public.is_organisation_member(uuid) to authenticated;

create or replace function public.prevent_audit_mutation() returns trigger language plpgsql as $$
begin raise exception 'Audit events are immutable'; end; $$;
drop trigger if exists audit_events_immutable on public.audit_events;
create trigger audit_events_immutable before update or delete on public.audit_events for each row execute function public.prevent_audit_mutation();

create index if not exists organisation_members_active_lookup_idx on public.organisation_members(user_id,organisation_id) where status='active';
create index if not exists organisations_active_lookup_idx on public.organisations(id) where status='active' and deleted_at is null;
commit;
