import type {MetadataRoute} from "next";
import {BaseUrl} from "@/lib/common/Constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BaseUrl,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/auth/signin`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/auth/signup`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/auth/password-reset`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/legal/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/legal/terms`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/settings`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/pricing/pricing`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/pricing/purchase`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/ai`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/password`,
      lastModified: new Date(),
    },
    {
      url: `${BaseUrl}/blog`,
      lastModified: new Date(),
    },
  ];
}
