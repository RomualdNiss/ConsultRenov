import { expect, test, type Page } from "@playwright/test";
import { services } from "../src/data/services";

const routes = [
  "/",
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/politique-confidentialite",
  "/services",
  ...services.map((service) => `/services/${service.slug}`),
];

const viewports = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-375", width: 375, height: 667 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
] as const;

type OverflowIssue = {
  selector: string;
  left: number;
  right: number;
  width: number;
  position: string;
  text: string;
};

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  expect(
    metrics.documentScrollWidth,
    `document scrollWidth ${metrics.documentScrollWidth} exceeds viewport ${metrics.clientWidth}`,
  ).toBeLessThanOrEqual(metrics.clientWidth + 1);

  expect(
    metrics.bodyScrollWidth,
    `body scrollWidth ${metrics.bodyScrollWidth} exceeds viewport ${metrics.clientWidth}`,
  ).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function expectElementsWithinViewport(page: Page, selector: string, label: string) {
  const locator = page.locator(selector);
  const count = await locator.count();

  if (!count) {
    return;
  }

  const issues = await locator.evaluateAll((elements) => {
    const viewportWidth = document.documentElement.clientWidth;

    const buildSelector = (element: Element) => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.id) {
        return `#${htmlElement.id}`;
      }

      const classNames = Array.from(htmlElement.classList).slice(0, 3);
      const classSuffix = classNames.length ? `.${classNames.join(".")}` : "";
      return `${htmlElement.tagName.toLowerCase()}${classSuffix}`;
    };

    return elements.flatMap((element) => {
      const htmlElement = element as HTMLElement;
      const style = window.getComputedStyle(htmlElement);
      const rect = htmlElement.getBoundingClientRect();

      if (style.display === "none" || style.visibility === "hidden") {
        return [];
      }

      if (rect.width < 1 || rect.height < 1) {
        return [];
      }

      if (rect.left >= -1 && rect.right <= viewportWidth + 1) {
        return [];
      }

      return [
        {
          selector: buildSelector(htmlElement),
          left: Number(rect.left.toFixed(1)),
          right: Number(rect.right.toFixed(1)),
          width: Number(rect.width.toFixed(1)),
          position: style.position,
          text: (htmlElement.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
        },
      ];
    });
  });

  expect(issues, `${label} should remain within the viewport`).toEqual([]);
}

async function expectNoOverflowingElements(page: Page) {
  const issues = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;

    const buildSelector = (element: HTMLElement) => {
      if (element.id) {
        return `#${element.id}`;
      }

      const classNames = Array.from(element.classList).slice(0, 3);
      const classSuffix = classNames.length ? `.${classNames.join(".")}` : "";
      return `${element.tagName.toLowerCase()}${classSuffix}`;
    };

    return Array.from(document.body.querySelectorAll<HTMLElement>("*"))
      .flatMap((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        if (style.display === "none" || style.visibility === "hidden") {
          return [];
        }

        if (rect.width < 1 || rect.height < 1) {
          return [];
        }

        if (rect.left >= -1 && rect.right <= viewportWidth + 1) {
          return [];
        }

        return [
          {
            selector: buildSelector(element),
            left: Number(rect.left.toFixed(1)),
            right: Number(rect.right.toFixed(1)),
            width: Number(rect.width.toFixed(1)),
            position: style.position,
            text: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
          },
        ];
      })
      .slice(0, 20);
  });

  expect(issues as OverflowIssue[], "No visible element should extend beyond the viewport").toEqual([]);
}

async function assertNavigationState(page: Page, width: number) {
  const desktopNav = page.locator(".header-nav");
  const mobileToggle = page.locator("[data-menu-toggle]");
  const mobileMenu = page.locator("[data-mobile-menu]");

  if (width <= 900) {
    await expect(desktopNav).toBeHidden();
    await expect(mobileToggle).toBeVisible();

    await mobileToggle.click();
    await expect(mobileToggle).toHaveAttribute("aria-expanded", "true");
    await expect(mobileMenu).toBeVisible();
    await expectElementsWithinViewport(page, ".mobile-menu, .mobile-menu .button, .mobile-menu .nav-link", "mobile menu");
    await expectNoHorizontalOverflow(page);

    await mobileToggle.click();
    await expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
    await expect(mobileMenu).toBeHidden();
    return;
  }

  await expect(desktopNav).toBeVisible();
  await expect(mobileToggle).toBeHidden();
}

async function assertKeyLayoutFits(page: Page, width: number) {
  await expectElementsWithinViewport(page, ".button", "CTA buttons");
  await expectElementsWithinViewport(page, ".cards-grid > *", "card grids");
  await expectElementsWithinViewport(page, ".breadcrumbs", "breadcrumbs");
  await expectElementsWithinViewport(page, ".footer", "footer");
  await expectElementsWithinViewport(page, ".contact-strip", "contact strip");
  await expectElementsWithinViewport(page, ".quote-form", "quote form");

  const formGrid = page.locator(".form-grid");
  if ((await formGrid.count()) && width <= 720) {
    const tops = await page.locator(".form-grid .form-field").evaluateAll((elements) =>
      elements.slice(0, 2).map((element) => Number((element as HTMLElement).getBoundingClientRect().top.toFixed(1))),
    );

    if (tops.length === 2) {
      expect(
        Math.abs(tops[0] - tops[1]),
        "Contact form fields should stack into a single column on narrow screens",
      ).toBeGreaterThan(8);
    }
  }
}

test.describe.configure({ mode: "parallel" });

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    for (const route of routes) {
      test(`${route} stays responsive`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(route, { waitUntil: "networkidle" });

        await assertNavigationState(page, viewport.width);
        await expectNoHorizontalOverflow(page);
        await expectNoOverflowingElements(page);
        await assertKeyLayoutFits(page, viewport.width);
      });
    }
  });
}
