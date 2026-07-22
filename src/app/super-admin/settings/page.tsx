import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveSettingsAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("platform_settings").select("key,value");
  const setting = (key: string) =>
    (data?.find((item) => item.key === key)?.value ?? {}) as Record<
      string,
      string | boolean
    >;
  const company = setting("company");
  const integrations = setting("integrations");
  const appearance = setting("appearance");
  const maintenance = setting("maintenance");
  return (
    <div>
      <PageHeader
        title="System settings"
        description="Manage company identity, communication channels, integrations, theme, and maintenance controls."
      />
      <form action={saveSettingsAction} className="space-y-6">
        <SettingsSection title="Company information">
          <Field
            name="company_name"
            label="Company name"
            value={company.name}
          />
          <Field
            name="support_email"
            label="Support email"
            type="email"
            value={company.support_email}
          />
          <Field
            name="sales_email"
            label="Sales email"
            type="email"
            value={company.sales_email}
          />
          <Field name="phone" label="Phone" value={company.phone} />
          <Field name="address" label="Address" value={company.address} />
        </SettingsSection>
        <SettingsSection title="Branding and theme">
          <Field
            name="logo_path"
            label="Logo path"
            value={appearance.logo_path}
          />
          <Field
            name="favicon_path"
            label="Favicon path"
            value={appearance.favicon_path}
          />
          <label className="text-sm font-semibold">
            Theme
            <select
              name="theme"
              defaultValue={String(appearance.theme ?? "system")}
              className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </SettingsSection>
        <SettingsSection title="SMTP and analytics placeholders">
          <Field
            name="smtp_host"
            label="SMTP host"
            value={integrations.smtp_host}
          />
          <Field
            name="smtp_port"
            label="SMTP port"
            value={integrations.smtp_port}
          />
          <Field
            name="google_analytics_id"
            label="Google Analytics ID"
            value={integrations.google_analytics_id}
          />
          <Field
            name="tag_manager_id"
            label="Tag Manager ID"
            value={integrations.tag_manager_id}
          />
        </SettingsSection>
        <SettingsSection title="Maintenance mode">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              name="maintenance_mode"
              defaultChecked={Boolean(maintenance.enabled)}
            />{" "}
            Enable maintenance mode
          </label>
          <Field
            name="maintenance_message"
            label="Maintenance message"
            value={maintenance.message}
          />
        </SettingsSection>
        <SubmitButton pending="Saving settings…">
          Save all settings
        </SubmitButton>
      </form>
    </div>
  );
}
function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
function Field({
  name,
  label,
  type = "text",
  value,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string | boolean;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={typeof value === "string" ? value : ""}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
      />
    </label>
  );
}
