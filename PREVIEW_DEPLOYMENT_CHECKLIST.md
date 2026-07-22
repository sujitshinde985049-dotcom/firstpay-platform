# Preview Deployment Checklist

- CI passes on the exact commit.
- Preview uses isolated Supabase and sandbox/mock providers only.
- Migrations applied and RLS verification recorded.
- Auth redirects, protected routes, suspended users, and Super Admin boundaries tested.
- Webhook invalid/replay cases and mock payment flows tested.
- Responsive, accessibility, legal, claims, SEO, headers, cache, and error-state smoke checks completed.
- No production secrets, users, provider calls, or live data are present.
