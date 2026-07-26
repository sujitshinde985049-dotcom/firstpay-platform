import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PendingMandateAction } from "./pending-mandate-action";

describe("PendingMandateAction", () => {
  it("renders the persisted PhonePe authorization action", () => {
    const markup = renderToStaticMarkup(
      <PendingMandateAction
        mandateStatus="pending"
        providerKey="phonepe"
        metadata={{
          authorization_url: "https://mercury.phonepe.com/authorize/123",
        }}
      />,
    );

    expect(markup).toContain("Continue to PhonePe");
    expect(markup).toContain(
      'href="https://mercury.phonepe.com/authorize/123"',
    );
  });

  it("does not render a fake action when no authorization URL exists", () => {
    const markup = renderToStaticMarkup(
      <PendingMandateAction
        mandateStatus="pending"
        providerKey="phonepe"
        metadata={{}}
      />,
    );

    expect(markup).not.toContain("<a");
    expect(markup).toContain("No authorization link or retry operation");
  });
});
