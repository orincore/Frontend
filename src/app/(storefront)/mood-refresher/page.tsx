import { getLandingPageBySlug, getProductsByIds } from "@/services/api";
import { LandingPageRenderer } from "@/components/storefront/landing-page-renderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLandingPageBySlug("mood-refresher");
  return {
    title: page?.seo.title || "Mood & Energy Refresher | Pratipal",
    description: page?.seo.description || "",
  };
}

export default async function MoodRefresherPage() {
  const page = await getLandingPageBySlug("mood-refresher");
  if (!page) return <div className="container py-20 text-center">Page not found</div>;

  const products = await getProductsByIds(page.linkedProducts);

  return <LandingPageRenderer page={page} products={products} />;
}
