import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-001",
    name: "Healing Candles by Pratipal",
    slug: "candles",
    description: "Hand-poured, crystal-infused candles designed for healing, meditation, and spiritual growth.",
    image: "https://images.unsplash.com/photo-1602607616907-0c8ba6845ef1?w=600&h=400&fit=crop",
    visibleOnHomepage: true,
  },
  {
    id: "cat-002",
    name: "Energy Infused Roll-On",
    slug: "rollon",
    description: "Therapeutic essential oil roll-ons crafted for emotional balance, focus, and well-being.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=400&fit=crop",
    visibleOnHomepage: true,
  },
  {
    id: "cat-003",
    name: "Energy Infused Intention Salt",
    slug: "salt",
    description: "Ritual salts charged with crystals and botanicals for space cleansing and intention setting.",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2c8f2be87?w=600&h=400&fit=crop",
    visibleOnHomepage: true,
  },
];
