"use client";

import React, { useEffect, useState } from "react";
import { Package, FolderTree, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 12,
    categories: 3,
    landingPages: 0,
    activeProducts: 11,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { count } = await supabase
        .from("landing_pages")
        .select("*", { count: "exact", head: true });
      setStats((prev) => ({
        ...prev,
        landingPages: count || 0,
      }));
    }
    load();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      description: `${stats.activeProducts} active`,
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderTree,
      description: "Product categories",
    },
    {
      title: "Landing Pages",
      value: stats.landingPages,
      icon: FileText,
      description: "Dynamic pages",
    },
    {
      title: "Conversion Rate",
      value: "4.2%",
      icon: TrendingUp,
      description: "Last 30 days",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
