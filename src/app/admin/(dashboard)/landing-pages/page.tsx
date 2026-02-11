"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Eye,
  Settings,
  Trash2,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DynamicLandingPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  theme: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export default function AdminLandingPages() {
  const router = useRouter();
  const [pages, setPages] = useState<DynamicLandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadPages() {
    try {
      const res = await fetch("/api/landing-pages", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load pages");
      }
      const data = await res.json();
      setPages(data.pages ?? []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load landing pages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true);

    const slug = newSlug.trim() || generateSlug(newTitle);

    try {
      const res = await fetch("/api/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create page");
      }

      const data = await res.json();
      toast.success("Landing page created!");
      setDialogOpen(false);
      setNewTitle("");
      setNewSlug("");
      router.push(`/admin/landing-pages/${data.page.id}/edit`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create page");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/landing-pages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete page");
      }

      toast.success("Page deleted");
      loadPages();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete page");
    }
  }

  async function toggleStatus(page: DynamicLandingPage) {
    const newStatus = page.status === "published" ? "draft" : "published";
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
      loadPages();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage dynamic landing pages
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Landing Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Page Title</Label>
                <Input
                  placeholder="e.g. Salt Magic Webinar"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    setNewSlug(generateSlug(e.target.value));
                  }}
                  autoFocus
                />
              </div>
              <div>
                <Label>URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    placeholder="salt-magic-webinar"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="w-full"
              >
                {creating ? "Creating..." : "Create & Edit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-1">No landing pages yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first dynamic landing page
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Create Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <CardTitle className="text-base truncate">
                      {page.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={
                      page.status === "published" ? "default" : "secondary"
                    }
                    className="cursor-pointer flex-shrink-0"
                    onClick={() => toggleStatus(page)}
                  >
                    {page.status === "published" ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" /> Live
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" /> Draft
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Route:</span>{" "}
                    /{page.slug}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Theme:
                    </span>
                    <div className="flex gap-1">
                      {page.theme &&
                        Object.values(page.theme)
                          .slice(0, 4)
                          .map((color, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    {new Date(page.updated_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link href={`/admin/landing-pages/${page.id}/edit`}>
                        <Settings className="h-3.5 w-3.5 mr-1" /> Edit
                      </Link>
                    </Button>
                    {page.status === "published" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${page.slug}`} target="_blank">
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete page?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{page.title}
                            &quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
