"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import {
  AgeGroupEnum,
  GenderEnum,
  ProductStatusEnum,
} from "@/types/enums";
import type { ProductFormInput, ProductUpdateInput } from "@/types/product";
import {
  SIZE_GUIDE_FOLDER,
  UploadRequestInput,
  UploadRequestResponseSchema,
  type UploadRequestResponse,
} from "@/types/storage";

const invalidateKeys = [queryKeys.products.all] as const;

/** All product mutations (create, update, delete). */
export function useProductMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, ProductFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.PRODUCTS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product created successfully!",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.PRODUCTS.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product deleted successfully!",
  });

const update = useAppMutation<void, { id: string; payload: ProductUpdateInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.patch(API_ROUTES.PRODUCTS.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated successfully!",
  });

  /**
   * Asks the backend for a short-lived, single-use presigned upload URL for a
   * size guide image. The caller PUTs the file to `signedUrl` and stores the
   * returned `publicUrl` as the product's size guide URL.
   */
  const requestSizeGuideUpload = async (file: File): Promise<UploadRequestResponse> => {
    const payload: UploadRequestInput = {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      folder: SIZE_GUIDE_FOLDER,
    };

    const response = await axiosClient.post(API_ROUTES.STORAGE.UPLOAD_REQUESTS, payload);
    return UploadRequestResponseSchema.parse(response.data);
  };

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.patch(API_ROUTES.PRODUCTS.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated",
  });

  const toggleFeaturedStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.patch(API_ROUTES.PRODUCTS.TOGGLE_FEATURED_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated",
  });

  const changeGender = useAppMutation<void, { id: string; gender: GenderEnum }>({
    mutationFn: ({ id, gender }) =>
      axiosClient
        .patch(API_ROUTES.PRODUCTS.CHANGE_GENDER(id), { newGender: Number(gender) })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product gender updated",
  });

  const changeAgeGroup = useAppMutation<void, { id: string; ageGroup: AgeGroupEnum }>({
    mutationFn: ({ id, ageGroup }) =>
      axiosClient
        .patch(API_ROUTES.PRODUCTS.CHANGE_AGE_GROUP(id), { newAgeGroup: Number(ageGroup) })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product age group updated",
  });

  const changeProductStatus = useAppMutation<void, { id: string; status: ProductStatusEnum }>({
    mutationFn: ({ id, status }) =>
      axiosClient
        .patch(API_ROUTES.PRODUCTS.CHANGE_PRODUCT_STATUS(id), { newProductStatus: Number(status) })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product status updated",
  });

  const linkDesign = useAppMutation<void, { productId: string; designId: string }>({
    mutationFn: ({ productId, designId }) =>
      axiosClient
        .post(API_ROUTES.PRODUCTS.LINKED_DESIGNS(productId), { productId, designId })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Design linked to product successfully!",
  });

  const unlinkDesign = useAppMutation<void, { productId: string; designId: string }>({
    mutationFn: ({ productId, designId }) =>
      axiosClient
        .delete(API_ROUTES.PRODUCTS.LINKED_DESIGNS(productId), { data: { productId, designId } })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Design unlinked from product successfully!",
  });

  return {
    create,
    remove,
    update,
    requestSizeGuideUpload,
    toggleActiveStatus,
    toggleFeaturedStatus,
    changeGender,
    changeAgeGroup,
    changeProductStatus,
    linkDesign,
    unlinkDesign,
  };
}