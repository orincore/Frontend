"use client";

import React from "react";
import Image from "next/image";
import {
  Check,
  X,
  Sparkles,
  BookOpen,
  Users,
  Award,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LandingPage, LandingSection, Product } from "@/types";

interface LandingPageRendererProps {
  page: LandingPage;
  products: Product[];
}

export function LandingPageRenderer({
  page,
  products,
}: LandingPageRendererProps) {
  const visibleSections = page.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-[#f7fff9] to-[#e1f3e5]"
      style={{ backgroundColor: page.theme.background }}
    >
      {visibleSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          theme={page.theme}
          products={products}
        />
      ))}
    </div>
  );
}

function SectionRenderer({
  section,
  theme,
  products,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
  products: Product[];
}) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} theme={theme} />;
    case "truth":
      return <TruthSection section={section} theme={theme} />;
    case "audience":
      return <AudienceSection section={section} theme={theme} />;
    case "learn":
      return <LearnSection section={section} theme={theme} />;
    case "trainer":
      return <TrainerSection section={section} theme={theme} />;
    case "benefits":
      return <BenefitsSection section={section} theme={theme} />;
    case "products":
      return <ProductsSection section={section} products={products} />;
    case "faq":
      return <FaqSection section={section} />;
    case "cta":
      return <CtaSection section={section} theme={theme} />;
    default:
      return null;
  }
}

function HeroSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: theme.background }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-16">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <h1
              className="text-3xl md:text-5xl font-bold leading-tight mb-4"
              style={{ color: theme.primary }}
            >
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="text-lg md:text-xl mb-6" style={{ color: theme.secondary }}>
                {section.subtitle}
              </p>
            )}
            <p className="text-base text-muted-foreground mb-8">
              {section.content}
            </p>
            <Button
              size="lg"
              className="text-white shadow-xl"
              style={{ backgroundColor: theme.accent, color: theme.secondary }}
            >
              Explore Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {section.image && (
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TruthSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-12 md:py-16 bg-white/60">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-16">
        <h2
          className="text-2xl md:text-3xl font-bold mb-4 text-center"
          style={{ color: theme.primary }}
        >
          {section.title}
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          {section.content}
        </p>
        {section.items && (
          <div className="grid gap-4 md:grid-cols-2">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-5 rounded-2xl bg-gradient-to-r from-red-50 to-white border border-red-100/80 shadow-sm"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AudienceSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-2 justify-center mb-2">
          <Users className="h-5 w-5" style={{ color: theme.primary }} />
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: theme.primary }}
          >
            {section.title}
          </h2>
        </div>
        <p className="text-muted-foreground text-center mb-8">
          {section.content}
        </p>
        {section.items && (
          <div className="space-y-3">
            {section.items.map((item) => {
              const isNot = item.title.toLowerCase().includes("not for");
              return (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    isNot
                      ? "bg-orange-50/50 border-orange-100"
                      : "bg-green-50/50 border-green-100"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isNot ? (
                      <X className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function LearnSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-12 md:py-16 bg-white/60">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-2 justify-center mb-2">
          <BookOpen className="h-5 w-5" style={{ color: theme.primary }} />
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: theme.primary }}
          >
            {section.title}
          </h2>
        </div>
        <p className="text-muted-foreground text-center mb-8">
          {section.content}
        </p>
        {section.items && (
          <div className="grid gap-4 md:grid-cols-2">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-white shadow-sm"
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Sparkles
                    className="h-4 w-4"
                    style={{ color: theme.primary }}
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TrainerSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start rounded-3xl bg-white/80 p-6 md:p-10 shadow-xl">
          <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={
                section.image ||
                "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&h=400&fit=crop"
              }
              alt={section.title}
              fill
              sizes="(max-width: 768px) 50vw, 160px"
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{ color: theme.primary }}
            >
              {section.title}
            </h2>
            {section.subtitle && (
              <p
                className="text-sm font-medium mb-3"
                style={{ color: theme.secondary }}
              >
                {section.subtitle}
              </p>
            )}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {section.content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-12 md:py-16 bg-white/60">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-2 justify-center mb-2">
          <Award className="h-5 w-5" style={{ color: theme.primary }} />
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: theme.primary }}
          >
            {section.title}
          </h2>
        </div>
        <p className="text-muted-foreground text-center mb-8">
          {section.content}
        </p>
        {section.items && (
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-lg border bg-white shadow-sm"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-5 w-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductsSection({
  section,
  products,
}: {
  section: LandingSection;
  products: Product[];
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          {section.title}
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          {section.content}
        </p>
        <div className="space-y-1">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ section }: { section: LandingSection }) {
  return (
    <section className="py-12 md:py-16 bg-white/60">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-2 justify-center mb-6">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
        </div>
        {section.items && (
          <Accordion type="single" collapsible className="w-full">
            {section.items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-sm text-left">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}

function CtaSection({
  section,
  theme,
}: {
  section: LandingSection;
  theme: LandingPage["theme"];
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16 text-center">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: theme.primary }}
        >
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="text-muted-foreground mb-4">{section.subtitle}</p>
        )}
        <p className="text-sm text-muted-foreground mb-6">{section.content}</p>
        <Button
          size="lg"
          className="text-white shadow-lg px-10"
          style={{ backgroundColor: theme.accent }}
        >
          Shop Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
