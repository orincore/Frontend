import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { landingPages } from "@/data/landing-pages";
import { mediaItems } from "@/data/media";
import type {
  Product,
  Category,
  LandingPage,
  MediaItem,
  ProductCategory,
  LandingSlug,
} from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(100);
  return [...products];
}

export async function getActiveProducts(): Promise<Product[]> {
  await delay(100);
  return products.filter((p) => p.status === "active");
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(50);
  return products.find((p) => p.id === id);
}

export async function getProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  await delay(100);
  return products.filter(
    (p) => p.category === category && p.status === "active"
  );
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  await delay(100);
  return products.filter((p) => ids.includes(p.id) && p.status === "active");
}

export async function getCategories(): Promise<Category[]> {
  await delay(100);
  return [...categories];
}

export async function getVisibleCategories(): Promise<Category[]> {
  await delay(100);
  return categories.filter((c) => c.visibleOnHomepage);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  await delay(50);
  return categories.find((c) => c.slug === slug);
}

export async function getLandingPages(): Promise<LandingPage[]> {
  await delay(100);
  return [...landingPages];
}

export async function getLandingPageBySlug(
  slug: LandingSlug
): Promise<LandingPage | undefined> {
  await delay(100);
  return landingPages.find((lp) => lp.slug === slug);
}

export async function updateLandingPage(
  updated: LandingPage
): Promise<LandingPage> {
  await delay(200);
  const idx = landingPages.findIndex((lp) => lp.id === updated.id);
  if (idx !== -1) {
    landingPages[idx] = updated;
  }
  return updated;
}

export async function getMediaItems(): Promise<MediaItem[]> {
  await delay(100);
  return [...mediaItems];
}

export async function updateProduct(updated: Product): Promise<Product> {
  await delay(200);
  const idx = products.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    products[idx] = updated;
  }
  return updated;
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  await delay(200);
  const newProduct: Product = {
    ...product,
    id: `prod-${String(products.length + 1).padStart(3, "0")}`,
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateCategory(updated: Category): Promise<Category> {
  await delay(200);
  const idx = categories.findIndex((c) => c.id === updated.id);
  if (idx !== -1) {
    categories[idx] = updated;
  }
  return updated;
}

export async function createCategory(
  category: Omit<Category, "id">
): Promise<Category> {
  await delay(200);
  const newCategory: Category = {
    ...category,
    id: `cat-${String(categories.length + 1).padStart(3, "0")}`,
  };
  categories.push(newCategory);
  return newCategory;
}

export async function deleteCategory(id: string): Promise<void> {
  await delay(200);
  const idx = categories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    categories.splice(idx, 1);
  }
}
