import { ExternalLink } from "lucide-react";
import { getPendingMandateAction } from "../../lib/mandates/details";

export function PendingMandateAction({
  mandateStatus,
  providerKey,
  metadata,
}: {
  mandateStatus: string;
  providerKey: string | null;
  metadata: unknown;
}) {
  const action = getPendingMandateAction({
    mandateStatus,
    providerKey,
    metadata,
  });

  if (action) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        {action.label}
        <ExternalLink className="size-4" aria-hidden="true" />
      </a>
    );
  }

  if (mandateStatus === "pending" && providerKey?.toLowerCase() === "phonepe") {
    return (
      <p className="text-sm text-amber-700 dark:text-amber-300">
        PhonePe authorization is pending. No authorization link or retry
        operation is currently available for this mandate.
      </p>
    );
  }

  return null;
}
