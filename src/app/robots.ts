import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/mails/",
    },
    sitemap: "https://rokafmail.kr/sitemap.xml",
  };
}
