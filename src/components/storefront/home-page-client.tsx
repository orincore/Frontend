"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Star, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface HomePageClientProps {
  products: Product[];
}

export function HomePageClient({ products }: HomePageClientProps) {
  const candleProducts = products.filter((p) => p.category === "candles");
  const rollonProducts = products.filter((p) => p.category === "rollon");
  const saltProducts = products.filter((p) => p.category === "salt");
  const bestSellers = products.filter((p) => p.status === "active").slice(0, 6);

  return (
    <div className="bg-white">
      <HeroBanner />
      <CategoryGrid />
      <BrandingSection />
      <ProductSection
        title="Our Candles"
        subtitle="Crystal-infused healing candles handcrafted with pure essential oils and intention"
        products={candleProducts}
        href="/candles"
        bgClass="bg-brand-warm"
      />
      <LifestyleSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved products by our community of healers and wellness seekers"
        products={bestSellers}
        href="/"
        bgClass="bg-white"
      />
      <CtaBanner />
    </div>
  );
}

function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Most Awaited\nHavan Cups\nBack in Stock",
      subtitle: "Handcrafted with sacred herbs & pure ghee",
      image: "https://worldofoorja.com/cdn/shop/files/DSC0725.jpg?v=1758892916&width=610",
      cta: "Shop Now",
      href: "/candles",
    },
    {
      title: "Healing\nEssential Oil\nRoll-Ons",
      subtitle: "Therapeutic grade oils for everyday wellness",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=700&fit=crop",
      cta: "Explore",
      href: "/essential-oil",
    },
    {
      title: "Energy\nIntention\nSalts",
      subtitle: "Cleanse your aura with crystal-infused bath salts",
      image: "https://www.nytarra.in/cdn/shop/files/9_f34914c2-e1fa-453c-af98-4039446e9577.jpg?v=1767872410&width=823",
      cta: "Discover",
      href: "/mood-refresher",
    },
  ];

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="container">
        <div className="relative flex flex-col md:flex-row items-center min-h-[420px] md:min-h-[520px] py-8 md:py-0">
          <div className="relative z-10 flex-1 max-w-lg md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-primary leading-[1.1] whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-brand-primary/70 font-sans max-w-sm">
              {slide.subtitle}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3.5 rounded-full text-sm font-sans font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/30"
              >
                {slide.cta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="text-sm font-sans text-brand-secondary/70 hover:text-brand-secondary underline underline-offset-4 transition-colors"
              >
                View All Products
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "w-8 bg-brand-primary"
                      : "w-2 bg-brand-primary/20 hover:bg-brand-primary/40"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 relative mt-6 md:mt-0 w-full">
            <div className="mx-auto w-full max-w-xl rounded-[32px] bg-white/60 p-3 md:p-5 shadow-2xl shadow-brand-secondary/10">
              <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-[24px] overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/25 to-transparent" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5 text-brand-secondary" />
          </button>
          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hidden md:flex"
          >
            <ChevronRight className="h-5 w-5 text-brand-secondary" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  const categories = [
    {
      name: "Healing Candles",
      image: "https://worldofoorja.com/cdn/shop/files/DSC0725.jpg?v=1758892916&width=610",
      href: "/candles",
      span: "col-span-2 row-span-2",
    },
    {
      name: "Essential Oils",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop",
      href: "/essential-oil",
      span: "col-span-1",
    },
    {
      name: "Intention Salts",
      image: "https://nathabit.in/_nat/images/lavender_unwind_1_138ba5857f.jpg?format=auto&width=640&quality=75&f=n",
      href: "/mood-refresher",
      span: "col-span-1",
    },
    {
      name: "Gift Boxes",
      image: "https://www.thengacoco.com/cdn/shop/files/Evergreen3_720x.jpg?v=1724998015",
      href: "/",
      span: "col-span-1",
    },
    {
      name: "New Arrivals",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      href: "/",
      span: "col-span-1",
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-brand-support mb-3">
            Explore Our World
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative rounded-xl overflow-hidden ${cat.span}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-white font-serif text-lg md:text-xl font-semibold drop-shadow-lg">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-white/80 text-xs font-sans mt-1 group-hover:text-brand-support transition-colors">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandingSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=800&fit=crop"
          alt="Forest"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-dark/70" />
      </div>

      <div className="relative z-10 container text-center">
        <p className="text-brand-support/80 text-xs font-sans uppercase tracking-[0.4em] mb-6">
          Rooted in Ancient Wisdom
        </p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-none">
          प्रतिपाल
        </h2>
        <p className="text-lg md:text-xl text-white/70 font-serif italic max-w-xl mx-auto mb-3">
          &ldquo;To nurture, to protect, to heal&rdquo;
        </p>
        <p className="text-sm text-white/50 font-sans max-w-md mx-auto leading-relaxed">
          Every product is crafted with sacred intention, pure ingredients, and
          the ancient healing wisdom of Ayurveda and crystal therapy.
        </p>

        <div className="flex items-center justify-center gap-8 mt-10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-serif font-bold text-brand-support">100%</div>
            <div className="text-[11px] text-white/50 font-sans uppercase tracking-wider mt-1">Natural</div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-serif font-bold text-brand-support">500+</div>
            <div className="text-[11px] text-white/50 font-sans uppercase tracking-wider mt-1">Happy Souls</div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-serif font-bold text-brand-support">50+</div>
            <div className="text-[11px] text-white/50 font-sans uppercase tracking-wider mt-1">Products</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  href,
  bgClass,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  href: string;
  bgClass: string;
}) {
  return (
    <section className={`py-14 md:py-20 ${bgClass}`}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-brand-support mb-3">
            Handcrafted Collection
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-3">
            {title}
          </h2>
          <p className="text-sm text-brand-primary/60 font-sans max-w-lg mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={href}
            className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3 rounded-full text-sm font-sans font-medium tracking-wide transition-all duration-300"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductGridCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        <button
          onClick={() => addItem(product)}
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-primary hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>

        {product.status === "active" && (
          <div className="absolute top-3 left-3">
            <span className="bg-brand-purple text-white text-[10px] font-sans font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
              Popular
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-3 w-3 fill-brand-gold text-brand-gold"
            />
          ))}
          <span className="text-[10px] text-gray-400 font-sans ml-1">(24)</span>
        </div>

        <h3 className="text-sm font-sans font-medium text-gray-800 leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-serif font-bold text-brand-primary">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-brand-primary hover:text-white bg-brand-primary/5 hover:bg-brand-primary px-3 py-1.5 rounded-full transition-all duration-300"
          >
            <ShoppingBag className="h-3 w-3" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function LifestyleSection() {
  const items = [
    {
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop",
      title: "Energy Infused Roll-Ons",
      description: "Therapeutic essential oil blends for everyday healing",
      href: "/essential-oil",
    },
    {
      image: "https://nathabit.in/_nat/images/cinnamon_respite_2_fe9c8f0cd6.jpg?format=auto&width=640&quality=75&f=n",
      title: "Crystal Bath Salts",
      description: "Cleanse your energy with intention-infused bath rituals",
      href: "/mood-refresher",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[3/2]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-brand-gold text-[10px] font-sans uppercase tracking-[0.3em] mb-2">
                  Featured Collection
                </p>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm font-sans mb-4 max-w-xs">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-2 text-white text-sm font-sans font-medium group-hover:text-brand-gold transition-colors">
                  Explore Collection <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-purple">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-maroon/30 blur-3xl" />
      </div>

      <div className="relative z-10 container text-center">
        <p className="text-brand-gold/80 text-xs font-sans uppercase tracking-[0.4em] mb-4">
          Begin Your Healing Journey
        </p>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
          Discover the Power of<br />
          <span className="text-gradient-gold">Intentional Healing</span>
        </h2>
        <p className="text-white/50 text-sm font-sans max-w-md mx-auto mb-8 leading-relaxed">
          Join thousands who have transformed their wellness journey with our
          handcrafted healing products.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/candles"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark px-8 py-3.5 rounded-full text-sm font-sans font-semibold tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-brand-gold/20"
          >
            Shop Candles <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/essential-oil"
            className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-full text-sm font-sans font-medium tracking-wide transition-all duration-300"
          >
            Explore Essential Oils
          </Link>
        </div>
      </div>
    </section>
  );
}
