"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts, updateProduct, createProduct } from "@/services/api";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductCategory, ProductStatus } from "@/types";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditProduct({
      id: "",
      name: "",
      slug: "",
      category: "candles",
      price: 0,
      shortDescription: "",
      image: "https://images.unsplash.com/photo-1602607616907-0c8ba6845ef1?w=400&h=400&fit=crop",
      status: "draft",
      landingPages: [],
    });
    setIsNew(true);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditProduct({ ...product });
    setIsNew(false);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!editProduct) return;
    try {
      if (isNew) {
        const { id, ...rest } = editProduct;
        const created = await createProduct(rest);
        setProducts((prev) => [...prev, created]);
        toast.success("Product created successfully");
      } else {
        const updated = await updateProduct(editProduct);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success("Product updated successfully");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalogue
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Image</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Category</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3 hidden md:table-cell capitalize">
                      {product.category}
                    </td>
                    <td className="py-3">{formatPrice(product.price)}</td>
                    <td className="py-3 hidden sm:table-cell">
                      <Badge
                        variant={
                          product.status === "active" ? "success" : "warning"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Add Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editProduct.category}
                  onValueChange={(v) =>
                    setEditProduct({
                      ...editProduct,
                      category: v as ProductCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candles">Candles</SelectItem>
                    <SelectItem value="rollon">Roll-On</SelectItem>
                    <SelectItem value="salt">Salt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Short Description</Label>
                <Textarea
                  value={editProduct.shortDescription}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      shortDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editProduct.image}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editProduct.status}
                  onValueChange={(v) =>
                    setEditProduct({
                      ...editProduct,
                      status: v as ProductStatus,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isNew ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
