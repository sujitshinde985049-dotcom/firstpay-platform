# Client Dashboard

The `/dashboard` workspace is authenticated and resolves the active organisation from membership. Every structured tenant record carries `organisation_id`; database RLS is forced and checks membership (or platform Super Admin) on all operations.

## Modules

Overview, customers, mandates, payments, settlements, leads, reports, team, webhooks, API credentials, documents, notifications, organisation profile, and workspace settings.

Customer create/update/soft-delete and CSV reports are server-side flows. Credential secrets are never selected for display or export. Organisation documents use the private `organisation-documents` bucket under an organisation UUID prefix.

## Database

Apply `202607220003_client_dashboard.sql` after the first two migrations. It adds customers, mandates, payments, settlements, webhook endpoints/deliveries, API credential metadata, document folders/assets, notifications, and departments, plus tenant profile fields and indexes.
