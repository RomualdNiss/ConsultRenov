import { expect, test, type Page } from "@playwright/test";

async function getVisibleCardServices(page: Page) {
  return page.locator("[data-gallery-card]").evaluateAll((elements) =>
    elements
      .filter((element) => !element.hasAttribute("hidden"))
      .map((element) => (element.getAttribute("data-services") ?? "").split(",").filter(Boolean)),
  );
}

test("gallery supports multi-select service filters", async ({ page }) => {
  await page.goto("/galerie", { waitUntil: "networkidle" });

  await expect(page.locator("[data-gallery-card]")).toHaveCount(10);
  await expect(page.locator("[data-gallery-count]")).toContainText("10 visuels affichés");

  await page.locator('[data-service-filter="facade"]').click();
  let visibleServices = await getVisibleCardServices(page);
  expect(visibleServices.length).toBeGreaterThan(0);
  expect(visibleServices.every((services) => services.includes("facade"))).toBeTruthy();

  await page.locator('[data-service-filter="revetements-de-sol-et-exterieurs"]').click();
  visibleServices = await getVisibleCardServices(page);
  expect(visibleServices.length).toBeGreaterThan(0);
  expect(
    visibleServices.every(
      (services) =>
        services.includes("facade") || services.includes("revetements-de-sol-et-exterieurs"),
    ),
  ).toBeTruthy();

  await page.locator('[data-service-filter="facade"]').click();
  visibleServices = await getVisibleCardServices(page);
  expect(visibleServices.length).toBeGreaterThan(0);
  expect(
    visibleServices.every((services) => services.includes("revetements-de-sol-et-exterieurs")),
  ).toBeTruthy();

  await page.locator("[data-filter-reset]").click();
  await expect(page.locator("[data-gallery-count]")).toContainText("10 visuels affichés");
  visibleServices = await getVisibleCardServices(page);
  expect(visibleServices).toHaveLength(10);
});
