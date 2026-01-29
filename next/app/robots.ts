import type {MetadataRoute} from "next";
import {getBaseUrl} from "@/lib/common/Constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: [''],
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
