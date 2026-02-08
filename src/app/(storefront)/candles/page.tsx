import { getLandingPageBySlug, getProductsByIds } from "@/services/api";
import { LandingPageRenderer } from "@/components/storefront/landing-page-renderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLandingPageBySlug("candles");
  return {
    title: page?.seo.title || "Healing Candles | Pratipal",
    description: page?.seo.description || "",
  };
}

export default async function CandlesPage() {
  const page = await getLandingPageBySlug("candles");
  if (!page) return <div className="container py-20 text-center">Page not found</div>;

  const products = await getProductsByIds(page.linkedProducts);

  return <LandingPageRenderer page={page} products={products} />;
}
