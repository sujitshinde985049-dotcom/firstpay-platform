export const mandatePermissionDefinitions = [
  { code: "mandates.view", description: "View mandates" },
  { code: "mandates.manage", description: "Manage mandates" },
  { code: "mandates.create", description: "Create mandates" },
  { code: "mandates.update", description: "Update mandates" },
  { code: "mandates.cancel", description: "Cancel mandates" },
] as const;

export const mandatePermissionCodes = mandatePermissionDefinitions.map(
  ({ code }) => code,
);

export function missingMandatePermissionCodes(codes: string[]) {
  const available = new Set(codes);
  return mandatePermissionCodes.filter((code) => !available.has(code));
}
