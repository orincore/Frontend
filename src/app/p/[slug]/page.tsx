import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DynamicPageRenderer } from "@/components/storefront/dynamic-page-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("landing_pages")
    .select("seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Page Not Found" };

  return {
    title: data.seo_title || "Pratipal",
    description: data.seo_description || "",
  };
}

export default async function DynamicLandingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <DynamicPageRenderer
      content={data.content}
      theme={data.theme}
      title={data.title}
    />
  );
}
