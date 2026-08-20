import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services/product.service";
import type { Product } from "@/types/product";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const EMPTY_DRAFT = {
  name: "",
  description: "",
  shortDescription: "",
  price: "",
  discountPrice: "",
  category: "",
  stock: "",
  material: "",
  dimensions: "",
  weight: "",
  technique: "",
  care: "",
  featured: false,
};

function AdminProducts() {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => getProducts(),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [files, setFiles] = useState<File[]>([]);

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: ["admin", "products"],
    });

    void queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      /*
       * ============================
       * EDIT EXISTING PRODUCT
       * ============================
       *
       * Admin can edit all fields.
       */
      if (editing) {
        const payload: Record<string, unknown> = {
          name: draft.name,
          description: draft.description,

          shortDescription:
            draft.shortDescription ||
            draft.description.slice(0, 140),

          price: Number(draft.price),

          category: draft.category,

          stock: Number(draft.stock),

          material: draft.material,

          dimensions: draft.dimensions,

          weight: draft.weight,

          technique: draft.technique,

          care: draft.care,

          featured: draft.featured,
        };

        if (draft.discountPrice) {
          payload["discountPrice"] = Number(draft.discountPrice);
        }

        return updateProduct(
          editing.id,
          payload,
          files.length ? files : undefined,
        );
      }

      /*
       * ============================
       * CREATE NEW PRODUCT
       * ============================
       *
       * Admin only uploads image(s).
       *
       * Backend will:
       * 1. Upload image
       * 2. Send first image to Gemini
       * 3. Generate product details
       * 4. Create MongoDB product
       */
      if (!files.length) {
        throw new Error("Please upload at least one product image");
      }

      return createProduct(
        {},
        files,
      );
    },

    onSuccess: () => {
      toast.success(
        editing
          ? "Product updated"
          : "Product created using AI",
      );

      setOpen(false);
      setEditing(null);
      setDraft(EMPTY_DRAFT);
      setFiles([]);

      invalidate();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      toast.success("Product deleted");
      invalidate();
    },

    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete product",
      ),
  });

  /*
   * ============================
   * CREATE
   * ============================
   */
  const openCreate = () => {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setFiles([]);
    setOpen(true);
  };

  /*
   * ============================
   * EDIT
   * ============================
   */
  const openEdit = (product: Product) => {
    setEditing(product);

    setDraft({
      name: product.name,

      description: product.description,

      shortDescription: product.shortDescription,

      price: String(product.price),

      discountPrice:
        product.discountPrice
          ? String(product.discountPrice)
          : "",

      category: product.category,

      stock: String(product.stock),

      material: product.material ?? "",

      dimensions: product.dimensions ?? "",

      weight: product.weight ?? "",

      technique: product.technique ?? "",

      care: product.care ?? "",

      featured: Boolean(product.featured),
    });

    setFiles([]);
    setOpen(true);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">
          Products
        </h1>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="clay"
              onClick={openCreate}
            >
              <Plus
                className="size-4"
                strokeWidth={1.5}
              />

              New product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing
                  ? "Edit product"
                  : "New product"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2 sm:grid-cols-2">

              {/* ================================= */}
              {/* CREATE MODE                       */}
              {/* Only image upload is shown        */}
              {/* ================================= */}

              {!editing && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="p-images">
                    Product images
                  </Label>

                  <Input
                    id="p-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setFiles(
                        Array.from(
                          e.target.files ?? [],
                        ),
                      )
                    }
                  />

                  <p className="text-sm text-muted-foreground">
                    Upload your product image. Product
                    details will be generated automatically
                    using AI.
                  </p>
                </div>
              )}

              {/* ================================= */}
              {/* EDIT MODE                          */}
              {/* All fields are editable            */}
              {/* ================================= */}

              {editing && (
                <>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="p-name">
                      Name
                    </Label>

                    <Input
                      id="p-name"
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="p-desc">
                      Description
                    </Label>

                    <Textarea
                      id="p-desc"
                      rows={4}
                      value={draft.description}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          description:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="p-short">
                      Short description
                    </Label>

                    <Input
                      id="p-short"
                      value={draft.shortDescription}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          shortDescription:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-price">
                      Price (₹)
                    </Label>

                    <Input
                      id="p-price"
                      type="number"
                      value={draft.price}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-discount">
                      Discount price (₹)
                    </Label>

                    <Input
                      id="p-discount"
                      type="number"
                      value={draft.discountPrice}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          discountPrice:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-category">
                      Category
                    </Label>

                    <Input
                      id="p-category"
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          category:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-stock">
                      Stock
                    </Label>

                    <Input
                      id="p-stock"
                      type="number"
                      value={draft.stock}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-material">
                      Material
                    </Label>

                    <Input
                      id="p-material"
                      value={draft.material}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          material:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-dimensions">
                      Dimensions
                    </Label>

                    <Input
                      id="p-dimensions"
                      value={draft.dimensions}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          dimensions:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-weight">
                      Weight
                    </Label>

                    <Input
                      id="p-weight"
                      value={draft.weight}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          weight:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-technique">
                      Technique
                    </Label>

                    <Input
                      id="p-technique"
                      value={draft.technique}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          technique:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="p-care">
                      Care instructions
                    </Label>

                    <Input
                      id="p-care"
                      value={draft.care}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          care: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="p-images">
                      Images
                      {" "}
                      (leave empty to keep current images)
                    </Label>

                    <Input
                      id="p-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setFiles(
                          Array.from(
                            e.target.files ?? [],
                          ),
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Switch
                      checked={draft.featured}
                      onCheckedChange={(checked) =>
                        setDraft({
                          ...draft,
                          featured: checked,
                        })
                      }
                    />

                    <Label>
                      Show on homepage as featured
                    </Label>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="clay"
              className="mt-2 w-full"
              disabled={saveMutation.isPending}
              onClick={() =>
                saveMutation.mutate()
              }
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" />

                  {editing
                    ? "Saving..."
                    : "Generating product..."}
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Create product"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="surface-card mt-8 overflow-hidden rounded-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map(
              (_, i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-full"
                />
              ),
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Product
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Price
                </TableHead>

                <TableHead>
                  Stock
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {(products ?? []).map(
                (product) => (
                  <TableRow
                    key={product.id}
                  >
                    <TableCell className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="size-10 rounded-sm object-cover"
                      />

                      <span className="max-w-[220px] truncate">
                        {product.name}
                      </span>
                    </TableCell>

                    <TableCell>
                      {product.category}
                    </TableCell>

                    <TableCell>
                      {formatPrice(
                        product.discountPrice ??
                          product.price,
                      )}
                    </TableCell>

                    <TableCell>
                      {product.stock}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          openEdit(product)
                        }
                        aria-label="Edit"
                      >
                        <Pencil
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        aria-label="Delete"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete "${product.name}"?`,
                            )
                          ) {
                            deleteMutation.mutate(
                              product.id,
                            );
                          }
                        }}
                      >
                        <Trash2
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}