import type { StaticImageData } from "next/image";

export type ProductCategory = "candles" | "rollon" | "salt";
export type ProductStatus = "active" | "draft";
export type LandingSlug = "essential-oil" | "candles" | "mood-refresher";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  shortDescription: string;
  image: string;
  status: ProductStatus;
  landingPages: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  visibleOnHomepage: boolean;
}

export interface LandingPageTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface LandingPageSeo {
  title: string;
  description: string;
}

export type SectionType =
  | "hero"
  | "truth"
  | "audience"
  | "learn"
  | "trainer"
  | "benefits"
  | "products"
  | "faq"
  | "cta";

export interface LandingSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  content: string;
  visible: boolean;
  order: number;
  items?: SectionItem[];
  image?: string | StaticImageData;
}

export interface SectionItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface LandingPage {
  id: string;
  slug: LandingSlug;
  name: string;
  theme: LandingPageTheme;
  seo: LandingPageSeo;
  sections: LandingSection[];
  linkedProducts: string[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image";
  size: string;
  uploadedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
