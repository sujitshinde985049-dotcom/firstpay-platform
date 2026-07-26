import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ModuleTableRow } from "./module-table-row";

describe("ModuleTableRow", () => {
  it("makes the mandate row navigate to its details route", () => {
    const markup = renderToStaticMarkup(
      <table>
        <tbody>
          <ModuleTableRow
            row={{
              id: "mandate-id",
              primary: "emi",
              secondary: "UPI AutoPay",
              status: "pending",
              value: "₹1,000",
              date: "26/07/2026",
              href: "/dashboard/mandates/mandate-id",
            }}
          />
        </tbody>
      </table>,
    );

    expect(markup).toContain('href="/dashboard/mandates/mandate-id"');
    expect(markup).toContain('aria-label="View emi"');
  });
});
