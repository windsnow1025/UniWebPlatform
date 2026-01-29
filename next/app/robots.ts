import type {MetadataRoute} from "next";
import {BaseUrl} from "@/lib/common/Constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [''],
      disallow: [],
    },
    sitemap: `${BaseUrl}/sitemap.xml`,
  };
}
