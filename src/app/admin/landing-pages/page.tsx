"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Palette, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLandingPages } from "@/services/api";
import type { LandingPage } from "@/types";

export default function AdminLandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);

  useEffect(() => {
    getLandingPages().then(setPages);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <p className="text-sm text-muted-foreground">
          Manage your conversion-focused landing pages
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">{page.name}</CardTitle>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Route:</span>{" "}
                  /{page.slug}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Sections:</span>{" "}
                  {page.sections.filter((s) => s.visible).length} visible /{" "}
                  {page.sections.length} total
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Products:</span>{" "}
                  {page.linkedProducts.length} linked
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Theme:</span>
                  <div className="flex gap-1">
                    {[page.theme.primary, page.theme.secondary, page.theme.accent].map(
                      (color, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/admin/landing-pages/${page.slug}`}>
                      <Settings className="h-3.5 w-3.5 mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${page.slug}`} target="_blank">
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
