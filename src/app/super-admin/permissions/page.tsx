import { KeyRound } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { setRolePermissionAction } from "@/lib/admin/actions";
import { missingMandatePermissionCodes } from "@/lib/auth/permission-catalog";
import { createClient } from "@/lib/supabase/server";

export default async function PermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ organisation?: string }>;
}) {
  const organisationId = (await searchParams).organisation ?? "";
  const supabase = await createClient();
  const { data: organisations } = await supabase
    .from("organisations")
    .select("id,name")
    .is("deleted_at", null)
    .order("name");
  const [{ data: roles }, { data: permissions }, { data: grants }] =
    organisationId
      ? await Promise.all([
          supabase
            .from("organisation_roles")
            .select("id,name")
            .eq("organisation_id", organisationId)
            .order("name"),
          supabase
            .from("organisation_permissions")
            .select("id,code,description")
            .eq("organisation_id", organisationId)
            .order("code"),
          supabase
            .from("organisation_role_permissions")
            .select("role_id,permission_id")
            .eq("organisation_id", organisationId),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];
  const hasGrant = (roleId: string, permissionId: string) =>
    grants?.some(
      (grant) =>
        grant.role_id === roleId && grant.permission_id === permissionId,
    ) ?? false;
  const missingMandatePermissions = missingMandatePermissionCodes(
    permissions?.map((permission) => permission.code) ?? [],
  );
  return (
    <div>
      <PageHeader
        title="Role permissions"
        description="Assign organisation permissions to roles. User access changes immediately through database-enforced RBAC."
      />
      <form className="mb-6 flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row dark:bg-slate-950">
        <select
          name="organisation"
          defaultValue={organisationId}
          className="min-w-64 rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
        >
          <option value="">Select a client</option>
          {organisations?.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          Load permissions
        </button>
      </form>
      {organisationId ? (
        <>
          {missingMandatePermissions.length ? (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
            >
              Mandate permissions are not seeded for this client. Apply the
              latest Supabase migrations to display and assign:{" "}
              {missingMandatePermissions.join(", ")}.
            </div>
          ) : null}
          <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-slate-950">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900">
                <tr>
                  <th className="sticky left-0 bg-slate-50 px-5 py-4 dark:bg-slate-900">
                    Permission
                  </th>
                  {roles?.map((role) => (
                    <th key={role.id} className="px-4 text-center">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {permissions?.map((permission) => (
                  <tr key={permission.id}>
                    <td className="sticky left-0 bg-white px-5 py-4 dark:bg-slate-950">
                      <span className="flex items-start gap-3">
                        <KeyRound className="mt-0.5 size-4 text-blue-700" />
                        <span>
                          <strong className="block font-medium">
                            {permission.code}
                          </strong>
                          <small className="text-slate-500">
                            {permission.description}
                          </small>
                        </span>
                      </span>
                    </td>
                    {roles?.map((role) => {
                      const enabled = hasGrant(role.id, permission.id);
                      return (
                        <td key={role.id} className="px-4 text-center">
                          <form action={setRolePermissionAction}>
                            <input
                              type="hidden"
                              name="organisation_id"
                              value={organisationId}
                            />
                            <input
                              type="hidden"
                              name="role_id"
                              value={role.id}
                            />
                            <input
                              type="hidden"
                              name="permission_id"
                              value={permission.id}
                            />
                            <input
                              type="hidden"
                              name="enabled"
                              value={enabled ? "false" : "true"}
                            />
                            <SubmitButton
                              pending="Saving…"
                              aria-label={`${enabled ? "Remove" : "Assign"} ${permission.code} for ${role.name}`}
                              className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
                            >
                              {enabled ? "Allowed" : "Denied"}
                            </SubmitButton>
                          </form>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-slate-500">
          Select a client to manage its role permissions.
        </div>
      )}
    </div>
  );
}
