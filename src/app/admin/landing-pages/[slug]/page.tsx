"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLandingPageBySlug, updateLandingPage } from "@/services/api";
import type { LandingPage, LandingSection, LandingSlug, SectionType } from "@/types";
import { toast } from "sonner";

const sectionTypeLabels: Record<SectionType, string> = {
  hero: "Hero Section",
  truth: "Truth / Belief-Breaking",
  audience: "Who This Is For",
  learn: "What You'll Learn",
  trainer: "Trainer / About",
  benefits: "Benefits & Outcomes",
  products: "Product Grid",
  faq: "FAQ",
  cta: "Call to Action",
};

export default function LandingPageEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [page, setPage] = useState<LandingPage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLandingPageBySlug(slug as LandingSlug).then((p) => {
      if (p) setPage(p);
    });
  }, [slug]);

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<LandingSection>) => {
      if (!page) return;
      setPage({
        ...page,
        sections: page.sections.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      });
    },
    [page]
  );

  const moveSection = useCallback(
    (sectionId: string, direction: "up" | "down") => {
      if (!page) return;
      const sorted = [...page.sections].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === sectionId);
      if (
        (direction === "up" && idx <= 0) ||
        (direction === "down" && idx >= sorted.length - 1)
      )
        return;

      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      const tempOrder = sorted[idx].order;
      sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
      sorted[swapIdx] = { ...sorted[swapIdx], order: tempOrder };

      setPage({ ...page, sections: sorted });
    },
    [page]
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      if (!page) return;
      setPage({
        ...page,
        sections: page.sections.filter((s) => s.id !== sectionId),
      });
    },
    [page]
  );

  const addSection = useCallback(() => {
    if (!page) return;
    const maxOrder = Math.max(...page.sections.map((s) => s.order), 0);
    const newSection: LandingSection = {
      id: `sec-new-${Date.now()}`,
      type: "cta",
      title: "New Section",
      content: "Edit this section content.",
      visible: false,
      order: maxOrder + 1,
    };
    setPage({ ...page, sections: [...page.sections, newSection] });
  }, [page]);

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    try {
      await updateLandingPage(page);
      toast.success("Landing page saved successfully");
    } catch {
      toast.error("Failed to save landing page");
    }
    setSaving(false);
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/landing-pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{page.name}</h1>
          <p className="text-sm text-muted-foreground">/{page.slug}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${page.slug}`} target="_blank">
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" /> Theme Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["primary", "secondary", "accent", "background"] as const).map(
              (key) => (
                <div key={key}>
                  <Label className="capitalize text-xs">{key}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={page.theme[key]}
                      onChange={(e) =>
                        setPage({
                          ...page,
                          theme: { ...page.theme, [key]: e.target.value },
                        })
                      }
                      className="h-8 w-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={page.theme[key]}
                      onChange={(e) =>
                        setPage({
                          ...page,
                          theme: { ...page.theme, [key]: e.target.value },
                        })
                      }
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Page Title</Label>
            <Input
              value={page.seo.title}
              onChange={(e) =>
                setPage({
                  ...page,
                  seo: { ...page.seo, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Meta Description</Label>
            <Textarea
              value={page.seo.description}
              onChange={(e) =>
                setPage({
                  ...page,
                  seo: { ...page.seo, description: e.target.value },
                })
              }
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sections</h2>
        <Button variant="outline" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" /> Add Section
        </Button>
      </div>

      <div className="space-y-3">
        {sortedSections.map((section, idx) => (
          <Card
            key={section.id}
            className={!section.visible ? "opacity-60" : ""}
          >
            <CardHeader className="py-3 px-4">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {sectionTypeLabels[section.type] || section.type}
                    </Badge>
                    <span className="text-sm font-medium truncate">
                      {section.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveSection(section.id, "up")}
                    disabled={idx === 0}
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveSection(section.id, "down")}
                    disabled={idx === sortedSections.length - 1}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      updateSection(section.id, { visible: !section.visible })
                    }
                  >
                    {section.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <Separator className="mb-3" />
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      updateSection(section.id, { title: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>
                {section.subtitle !== undefined && (
                  <div>
                    <Label className="text-xs">Subtitle</Label>
                    <Input
                      value={section.subtitle || ""}
                      onChange={(e) =>
                        updateSection(section.id, { subtitle: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    value={section.content}
                    onChange={(e) =>
                      updateSection(section.id, { content: e.target.value })
                    }
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={section.visible}
                    onCheckedChange={(checked) =>
                      updateSection(section.id, { visible: checked })
                    }
                  />
                  <Label className="text-xs">
                    {section.visible ? "Visible" : "Hidden"}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
