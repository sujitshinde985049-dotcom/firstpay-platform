export type AuthenticatedAccess = {
  isSuperAdmin: boolean;
  organisationCount: number;
};

export function resolvePostLoginDestination(access: AuthenticatedAccess) {
  if (access.isSuperAdmin) return "/super-admin";
  if (access.organisationCount === 0) return "/dashboard/no-organisation";
  if (access.organisationCount > 1) return "/dashboard/select-organisation";
  return "/dashboard";
}

export function resolveDashboardDestination(access: AuthenticatedAccess) {
  return access.isSuperAdmin ? "/super-admin" : "/dashboard";
}
