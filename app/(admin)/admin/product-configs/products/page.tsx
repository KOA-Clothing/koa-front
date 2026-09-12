"use client";

import { useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useProducts } from "@/features/product/hooks/use-products";
import { getProductColumns } from "./columns";
import { ProductDto } from "@/types/product";
import { KoaTable } from "@/components/general/table/koa-table";
import { Shirt } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AddNewButton } from "@/components/general/add-new-button";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import CreateProductModal from "@/components/admin/product/modals/create-product-modal";
import DeleteProductConfirmationModal from "@/components/admin/product/modals/delete-product-confirmation-modal";
import UpdateProductModal from "@/components/admin/product/modals/update-product-modal";

export default function ProductsPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductDto | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);

  const { data, isLoading } = useProducts(pagination, search);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Products"}
        description={"Tangible apparel items built on a base category. Each product links a category to pricing, sizing, and display settings."}
        icon={<Shirt />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Products..."
        />

        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div>
      </div>

      <KoaTable
        columns={getProductColumns({
          onEdit: setProductToEdit,
          onDelete: setProductToDelete,
          onView: (product) => console.log(product),
          toggleFeaturedStatus: (product) => console.log(product),
          toggleActiveStatus: (product) => console.log(product),
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />

      <CreateProductModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <DeleteProductConfirmationModal
        product={productToDelete}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      />

      <UpdateProductModal
        product={productToEdit}
        onOpenChange={(open) => {
          if (!open) setProductToEdit(null);
        }}
      />
    </div>
  );
}