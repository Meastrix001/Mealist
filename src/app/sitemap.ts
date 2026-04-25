import type { MetadataRoute } from "next";
import { brand } from "@/theme/brand.config";
import { getAllRecipeSlugs } from "@/api/firebase.config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = brand.company.site;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site, changeFrequency: "daily", priority: 1.0 },
    { url: `${site}about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  let slugs: string[] = [];
  try {
    slugs = await getAllRecipeSlugs();
  } catch {
    slugs = [];
  }

  const recipeRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${site}recipes/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...recipeRoutes];
}
