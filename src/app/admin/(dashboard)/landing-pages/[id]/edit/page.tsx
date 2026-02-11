"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Palette,
  Globe,
  Clock,
  Settings2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RichEditor } from "@/components/admin/rich-editor";
import {
  normalizeLandingContent,
  type LandingContent,
} from "@/lib/tiptap/content";
import { toast } from "sonner";

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: LandingContent;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  seo_title: string;
  seo_description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function LandingPageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/landing-pages/${pageId}`);
        if (!res.ok) {
          throw new Error("Failed to load page");
        }
        const data = await res.json();
        if (!data.page) {
          throw new Error("Page not found");
        }
        setPage({
          ...data.page,
          content: normalizeLandingContent(data.page.content),
        });
        setLoading(false);
      } catch (err: any) {
        toast.error(err.message || "Page not found");
        router.push("/admin/landing-pages");
      }
    }
    load();
  }, [pageId, router]);

  const handleContentChange = useCallback((content: LandingContent) => {
    setPage((prev) => (prev ? { ...prev, content } : null));
  }, []);

  const handleThemeChange = useCallback(
    (key: string, value: string) => {
      setPage((prev) =>
        prev ? { ...prev, theme: { ...prev.theme, [key]: value } } : null
      );
    },
    []
  );

  async function handleSave() {
    if (!page) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/landing-pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          content: page.content,
          theme: page.theme,
          seo_title: page.seo_title,
          seo_description: page.seo_description,
          status: page.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save page");
      }

      toast.success("Page saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!page) return;
    const newStatus = page.status === "published" ? "draft" : "published";
    setPage({ ...page, status: newStatus });

    try {
      const res = await fetch(`/api/landing-pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(
        newStatus === "published" ? "Page published!" : "Page unpublished"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      setPage({ ...page, status: page.status });
    }
  }

  if (loading || !page) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/landing-pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <Input
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
            className="text-xl font-bold border-0 px-0 h-auto focus-visible:ring-0 shadow-none"
            placeholder="Page title..."
          />
          <p className="text-xs text-muted-foreground mt-0.5">/{page.slug}</p>
        </div>
        <Badge
          variant={page.status === "published" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={togglePublish}
        >
          {page.status === "published" ? (
            <>
              <Globe className="h-3 w-3 mr-1" /> Published
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 mr-1" /> Draft
            </>
          )}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings2 className="h-4 w-4 mr-1" />
          Settings
        </Button>
        {page.status === "published" && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${page.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Link>
          </Button>
        )}
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main editor */}
        <div>
          <RichEditor
            content={page.content}
            onChange={handleContentChange}
            themeColors={page.theme}
          />
        </div>

        {/* Settings sidebar */}
        {showSettings && (
          <div className="space-y-4">
            {/* Page Settings */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Page Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={page.title}
                    onChange={(e) =>
                      setPage({ ...page, title: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL Slug</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">/</span>
                    <Input
                      value={page.slug}
                      onChange={(e) =>
                        setPage({ ...page, slug: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={page.status === "published"}
                    onCheckedChange={() => togglePublish()}
                  />
                  <Label className="text-xs">
                    {page.status === "published" ? "Published" : "Draft"}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Theme Colors */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Theme Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  ["primary", "secondary", "accent", "background"] as const
                ).map((key) => (
                  <div key={key}>
                    <Label className="capitalize text-xs">{key}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={page.theme[key]}
                        onChange={(e) => handleThemeChange(key, e.target.value)}
                        className="h-7 w-7 rounded border cursor-pointer"
                      />
                      <Input
                        value={page.theme[key]}
                        onChange={(e) =>
                          handleThemeChange(key, e.target.value)
                        }
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">SEO Title</Label>
                  <Input
                    value={page.seo_title}
                    onChange={(e) =>
                      setPage({ ...page, seo_title: e.target.value })
                    }
                    className="h-8 text-sm"
                    placeholder="Page title for search engines"
                  />
                </div>
                <div>
                  <Label className="text-xs">Meta Description</Label>
                  <Textarea
                    value={page.seo_description}
                    onChange={(e) =>
                      setPage({ ...page, seo_description: e.target.value })
                    }
                    rows={3}
                    className="text-sm"
                    placeholder="Brief description for search results"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
