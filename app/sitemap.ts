import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-29T00:00:00-04:00");
  const pages = ["", "/privacy", "/terms", "/accessibility"];

  return pages.map((path) => ({
    url: `https://1118.io${path}`,
    lastModified,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.3,
  }));
}
