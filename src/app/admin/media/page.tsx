"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, Check, Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaItems } from "@/services/api";
import type { MediaItem } from "@/types";
import { toast } from "sonner";

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getMediaItems().then(setMedia);
  }, []);

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  function handleDummyUpload() {
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      name: `upload-${Date.now()}.jpg`,
      url: "https://images.unsplash.com/photo-1602607616907-0c8ba6845ef1?w=600&h=400&fit=crop",
      type: "image",
      size: "256 KB",
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setMedia((prev) => [newItem, ...prev]);
    toast.success("Image uploaded (dummy)");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Manage images and assets
          </p>
        </div>
        <Button onClick={handleDummyUpload}>
          <Upload className="h-4 w-4 mr-1" /> Upload Image
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all ${
              selected === item.id
                ? "ring-2 ring-brand-primary border-brand-primary"
                : "hover:border-muted-foreground/30"
            }`}
            onClick={() => setSelected(item.id === selected ? null : item.id)}
          >
            <div className="relative aspect-square bg-muted">
              <Image
                src={item.url}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />
              {selected === item.id && (
                <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {item.size}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(item.url);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No media items found.
        </div>
      )}
    </div>
  );
}
