import type { MetadataRoute } from "next";
import { brand } from "@/theme/brand.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${brand.company.site}sitemap.xml`,
  };
}
