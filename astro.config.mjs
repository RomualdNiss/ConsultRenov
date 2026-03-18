// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const configuredSite = process.env.PUBLIC_SITE_URL || "https://www.consultrenov.fr/";
const siteUrl = new URL(configuredSite);
const basePath =
  siteUrl.pathname && siteUrl.pathname !== "/" ? siteUrl.pathname.replace(/\/?$/, "/") : "/";

export default defineConfig({
  site: siteUrl.toString(),
  base: basePath,
  output: "static",
  integrations: [sitemap()],
  vite: {
    server: {
      host: true,
    },
  },
});
