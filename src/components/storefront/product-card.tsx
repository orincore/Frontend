"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 80px, 96px"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-brand-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            onClick={() => addItem(product)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
