"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search, User, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { CartDrawer } from "./cart-drawer";
import LogoMark from "@/app/assets/logo.png";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-brand-dark text-brand-support/80 text-[11px] tracking-wider text-center py-1.5 font-sans hidden sm:block">
        FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; HANDCRAFTED WITH LOVE & INTENTION
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-brand-secondary/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-purple"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-white/80 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-16">
                <Image
                  src={LogoMark}
                  alt="Pratipal logo"
                  fill
                  sizes="64px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-sans tracking-wide">
            <Link
              href="/"
              className="text-white/80 hover:text-brand-accent transition-colors duration-200 uppercase"
            >
              Shop
            </Link>
            <Link
              href="/candles"
              className="text-white/80 hover:text-brand-accent transition-colors duration-200 uppercase"
            >
              Healing Candles
            </Link>
            <Link
              href="/essential-oil"
              className="text-white/80 hover:text-brand-accent transition-colors duration-200 uppercase"
            >
              Essential Oils
            </Link>
            <Link
              href="/mood-refresher"
              className="text-white/80 hover:text-brand-accent transition-colors duration-200 uppercase"
            >
              Intention Salts
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:text-brand-accent hover:bg-white/10 transition-all">
              <Search className="h-4 w-4" />
            </button>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:text-brand-accent hover:bg-white/10 transition-all">
              <Heart className="h-4 w-4" />
            </button>
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:text-brand-accent hover:bg-white/10 transition-all">
              <User className="h-4 w-4" />
            </button>
            <button
              className="relative h-9 w-9 flex items-center justify-center rounded-full text-white/70 hover:text-brand-accent hover:bg-white/10 transition-all"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-brand-cta text-[9px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-brand-dark/95 backdrop-blur-md border-t border-white/10 px-6 py-5 space-y-4">
            <Link
              href="/"
              className="block text-sm text-white/80 hover:text-brand-accent uppercase tracking-wider font-sans"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/candles"
              className="block text-sm text-white/80 hover:text-brand-accent uppercase tracking-wider font-sans"
              onClick={() => setMenuOpen(false)}
            >
              Healing Candles
            </Link>
            <Link
              href="/essential-oil"
              className="block text-sm text-white/80 hover:text-brand-accent uppercase tracking-wider font-sans"
              onClick={() => setMenuOpen(false)}
            >
              Essential Oils
            </Link>
            <Link
              href="/mood-refresher"
              className="block text-sm text-white/80 hover:text-brand-accent uppercase tracking-wider font-sans"
              onClick={() => setMenuOpen(false)}
            >
              Intention Salts
            </Link>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
