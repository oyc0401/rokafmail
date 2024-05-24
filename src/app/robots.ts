import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mail/", "/mails/"]
    },
    sitemap: "https://rokafmail.kr/sitemap.xml",
  };
}
