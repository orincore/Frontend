import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import LogoMark from "@/app/assets/logo.png";

export function Footer() {
  return (
    <footer>
      <div className="bg-brand-cream py-14 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12">
                  <Image
                    src={LogoMark}
                    alt="Pratipal logo"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-purple">
                  Pratipal
                </h3>
              </div>
              <p className="text-sm text-brand-purple/50 font-sans leading-relaxed mb-5">
                Handcrafted healing products rooted in ancient Ayurvedic wisdom
                and crystal therapy. Every product is made with sacred intention
                and pure ingredients.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="h-9 w-9 rounded-full bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand-purple font-semibold mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Shop All", href: "/" },
                  { label: "Healing Candles", href: "/candles" },
                  { label: "Essential Oils", href: "/essential-oil" },
                  { label: "Intention Salts", href: "/mood-refresher" },
                  { label: "Gift Boxes", href: "/" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-sans text-brand-purple/50 hover:text-brand-purple transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand-purple font-semibold mb-5">
                Help & Info
              </h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Shipping Policy",
                  "Return & Refund",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((label) => (
                  <li key={label}>
                    <Link
                      href="/"
                      className="text-sm font-sans text-brand-purple/50 hover:text-brand-purple transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand-purple font-semibold mb-5">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-sans text-brand-purple/50">
                    hello@pratipal.in
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-sans text-brand-purple/50">
                    +91 98765 43210
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-sans text-brand-purple/50">
                    Jaipur, Rajasthan, India
                  </span>
                </li>
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/10">
                <p className="text-[11px] font-sans text-brand-purple/40 uppercase tracking-wider mb-2">
                  Trusted by
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-brand-gold fill-brand-gold" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs font-sans text-brand-purple/50 ml-1">
                    4.9/5 (500+ reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-purple py-5">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-sans text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} Pratipal. All rights reserved.
          </p>
          <p className="text-[11px] font-sans text-white/30 tracking-wider">
            Handcrafted with love & intention in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
