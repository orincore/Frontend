import { getProducts } from "@/services/api";
import { HomePageClient } from "@/components/storefront/home-page-client";

export default async function HomePage() {
  const products = await getProducts();

  return <HomePageClient products={products} />;
}
