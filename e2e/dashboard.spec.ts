import { test, expect } from "@playwright/test";

test.describe("Dashboard regression tests", () => {
  test("loads the dashboard and displays its main controls", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /customize dashboard widgets/i })
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: /search dashboard/i }))
      .toBeVisible();
  });

  test("shows all 14 widgets in dashboard settings", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /customize dashboard widgets/i })
      .click();

    const expectedWidgets = [
      "Portfolio Summary",
      "Portfolio Performance",
      "Asset Allocation",
      "Risk Analysis",
      "Market Status",
      "Top Holdings",
      "Recent Transactions",
      "Sector Exposure",
      "Benchmark Comparison",
      "Dividend Income",
      "Drawdown Analysis",
      "Risk Metrics",
      "Correlation Matrix",
      "Brinson Performance Attribution",
    ];

    for (const title of expectedWidgets) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
    }
  });

  test("does not introduce horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(page.getByRole("main")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));

    expect(
      dimensions.documentWidth,
      `Page overflows horizontally: ${JSON.stringify(dimensions)}`
    ).toBeLessThanOrEqual(dimensions.viewportWidth);
  });
});
