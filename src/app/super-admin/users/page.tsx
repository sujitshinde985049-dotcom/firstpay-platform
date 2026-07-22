import { Search, Shield, UserCog } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  assignUserRoleAction,
  deleteUserAction,
  setUserActiveAction,
} from "@/lib/admin/actions";
import { PAGE_SIZE } from "@/lib/admin/data";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q ?? "";
  const type = params.type ?? "all";
  const page = Math.max(1, Number(params.page ?? 1));
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select(
      "id,full_name,is_super_admin,created_at,deactivated_at,deleted_at,members:organisation_members(id,status,organisation_id,organisation:organisations(name),roles:organisation_member_roles(role:organisation_roles(id,name)))",
      { count: "exact" },
    )
    .is("deleted_at", null);
  if (search) query = query.ilike("full_name", `%${search}%`);
  if (type === "platform") query = query.eq("is_super_admin", true);
  if (type === "client") query = query.eq("is_super_admin", false);
  const from = (page - 1) * PAGE_SIZE;
  const { data: users, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  const { data: roles } = await supabase
    .from("organisation_roles")
    .select("id,name,organisation_id")
    .order("name");
  return (
    <div>
      <PageHeader
        title="User management"
        description="Manage platform and client users, roles, account status, and lifecycle controls."
      />
      <form className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_180px_auto] dark:bg-slate-950">
        <label className="relative">
          <Search className="absolute top-3 left-3 size-4 text-slate-400" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search users"
            className="w-full rounded-lg border bg-slate-50 py-2.5 pr-3 pl-10 text-sm dark:bg-slate-900"
          />
          <span className="sr-only">Search users</span>
        </label>
        <select
          name="type"
          defaultValue={type}
          className="rounded-lg border bg-slate-50 px-3 text-sm dark:bg-slate-900"
        >
          <option value="all">All users</option>
          <option value="platform">Platform users</option>
          <option value="client">Client users</option>
        </select>
        <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          Apply
        </button>
      </form>
      <div className="space-y-4">
        {users?.map((user) => (
          <article
            key={user.id}
            className="rounded-2xl border bg-white p-5 dark:bg-slate-950"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {user.is_super_admin ? (
                    <Shield className="size-5" />
                  ) : (
                    <UserCog className="size-5" />
                  )}
                </span>
                <span>
                  <strong className="block">
                    {user.full_name ?? "Unnamed user"}
                  </strong>
                  <small className="text-slate-500">{user.id}</small>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  value={user.deactivated_at ? "deactivated" : "active"}
                />
                <StatusBadge
                  value={user.is_super_admin ? "platform" : "client"}
                />
                {!user.is_super_admin ? (
                  <>
                    <form action={setUserActiveAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={user.deactivated_at ? "true" : "false"}
                      />
                      <SubmitButton
                        pending="Saving…"
                        className="rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50"
                      >
                        {user.deactivated_at ? "Activate" : "Deactivate"}
                      </SubmitButton>
                    </form>
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <SubmitButton
                        pending="Deleting…"
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                      >
                        Soft delete
                      </SubmitButton>
                    </form>
                  </>
                ) : null}
              </div>
            </div>
            <div className="mt-4 space-y-3 border-t pt-4">
              {user.members?.map((member) => {
                const org = Array.isArray(member.organisation)
                  ? member.organisation[0]
                  : member.organisation;
                const currentRole = member.roles?.[0]?.role;
                const normalizedRole = Array.isArray(currentRole)
                  ? currentRole[0]
                  : currentRole;
                return (
                  <form
                    key={member.id}
                    action={assignUserRoleAction}
                    className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center dark:bg-slate-900"
                  >
                    <input type="hidden" name="member_id" value={member.id} />
                    <input
                      type="hidden"
                      name="organisation_id"
                      value={member.organisation_id}
                    />
                    <span className="min-w-40 text-sm font-medium">
                      {org?.name ?? "Organisation"}
                    </span>
                    <select
                      name="role_id"
                      defaultValue={normalizedRole?.id ?? ""}
                      className="min-w-48 rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-950"
                    >
                      {roles
                        ?.filter(
                          (role) =>
                            role.organisation_id === member.organisation_id,
                        )
                        .map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                    </select>
                    <SubmitButton
                      pending="Assigning…"
                      className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Assign role
                    </SubmitButton>
                  </form>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Showing {users?.length ?? 0} of {count ?? 0} users · Page {page}
      </p>
    </div>
  );
}
