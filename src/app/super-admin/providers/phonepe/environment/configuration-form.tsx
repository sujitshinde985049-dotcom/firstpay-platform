"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  savePhonePeConfiguration,
  type PhonePeConfigurationState,
} from "./actions";
import { missingWebhookConfigurationMessage } from "./webhook-policy";

type Configuration = {
  environment: "sandbox" | "production";
  clientId: string;
  clientVersion: string;
  merchantId: string;
  oauthUrl: string;
  subscriptionUrl: string;
  hasClientSecret: boolean;
  hasWebhookSecret: boolean;
};

const initialState: PhonePeConfigurationState = { status: "idle" };

export function PhonePeConfigurationForm({
  configuration,
}: {
  configuration: Configuration;
}) {
  const [state, action] = useActionState(
    savePhonePeConfiguration,
    initialState,
  );
  return (
    <form action={action} className="space-y-6">
      {state.message ? (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.status === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:bg-red-950/30"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30"
          }`}
        >
          {state.message}
        </div>
      ) : null}
      <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="font-semibold">Environment and credentials</h2>
        <p className="mt-2 text-sm text-slate-500">
          Secrets are encrypted before storage and are never returned to this
          page.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Environment
            <select
              name="environment"
              defaultValue={configuration.environment}
              required
              className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
            >
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
          </label>
          <Field
            name="client_id"
            label="Client ID"
            defaultValue={configuration.clientId}
            error={state.errors?.clientId?.[0]}
            required
          />
          <Field
            name="client_secret"
            label="Client Secret"
            type="password"
            placeholder={
              configuration.hasClientSecret
                ? "Configured — enter a new value to rotate"
                : "Enter Client Secret"
            }
            error={state.errors?.clientSecret?.[0]}
            autoComplete="new-password"
          />
          <Field
            name="client_version"
            label="Client Version"
            defaultValue={configuration.clientVersion}
            error={state.errors?.clientVersion?.[0]}
            required
          />
          <Field
            name="merchant_id"
            label="Merchant ID"
            defaultValue={configuration.merchantId}
            error={state.errors?.merchantId?.[0]}
            required
          />
          <Field
            name="webhook_secret"
            label="Webhook Secret"
            type="password"
            placeholder={
              configuration.hasWebhookSecret
                ? "Configured — enter a new value to rotate"
                : "Enter Webhook Secret"
            }
            error={state.errors?.webhookSecret?.[0]}
            autoComplete="new-password"
          />
          {!configuration.hasWebhookSecret ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900 md:col-span-2 dark:bg-amber-950/30 dark:text-amber-100">
              {missingWebhookConfigurationMessage}
            </p>
          ) : null}
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="font-semibold">Provider endpoints</h2>
        <div className="mt-5 grid gap-5">
          <Field
            name="oauth_url"
            label="OAuth URL"
            type="url"
            defaultValue={configuration.oauthUrl}
            error={state.errors?.oauthUrl?.[0]}
            required
          />
          <Field
            name="subscription_url"
            label="Subscription URL"
            type="url"
            defaultValue={configuration.subscriptionUrl}
            error={state.errors?.subscriptionUrl?.[0]}
            required
          />
        </div>
      </section>
      <SubmitButton pending="Saving configuration…">
        Save PhonePe configuration
      </SubmitButton>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  error,
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
      />
      {error ? (
        <span id={errorId} className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
