import { getLandingPageBySlug, getProductsByIds } from "@/services/api";
import { LandingPageRenderer } from "@/components/storefront/landing-page-renderer";
import type { Metadata } from "next";
import LogoMark from "@/app/assets/logo.png";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLandingPageBySlug("essential-oil");
  return {
    title: page?.seo.title || "Essential Oils | Pratipal",
    description: page?.seo.description || "",
    icons: {
      icon: LogoMark.src,
      shortcut: LogoMark.src,
      apple: LogoMark.src,
    },
    openGraph: {
      title: page?.seo.title || "Essential Oils | Pratipal",
      description: page?.seo.description || "",
      images: [LogoMark.src],
    },
  };
}

export default async function EssentialOilPage() {
  const page = await getLandingPageBySlug("essential-oil");
  if (!page) return <div className="container py-20 text-center">Page not found</div>;

  const products = await getProductsByIds(page.linkedProducts);

  return <LandingPageRenderer page={page} products={products} />;
}
