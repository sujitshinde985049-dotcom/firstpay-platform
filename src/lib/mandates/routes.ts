export const mandateRoutes = {
  list: "/dashboard/mandates",
  create: "/dashboard/mandates/new",
  details: (mandateId: string) => `/dashboard/mandates/${mandateId}`,
} as const;
