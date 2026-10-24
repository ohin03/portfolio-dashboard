import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Dashboard accessibility", () => {
test("checks WCAG 2.1 A and AA accessibility rules", async ({
page,
}) => {
await page.goto("/");


await expect(page.getByRole("main")).toBeVisible();

const results = await new AxeBuilder({ page })
  .withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
  ])
  .analyze();

const violations = results.violations.map((violation) => ({
  id: violation.id,
  impact: violation.impact,
  description: violation.description,
  affectedElements: violation.nodes.map((node) => ({
    target: node.target,
    summary: node.failureSummary,
  })),
}));

expect(
  violations,
  JSON.stringify(violations, null, 2),
).toEqual([]);


});
});
