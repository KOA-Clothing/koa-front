"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import { API_ROUTES } from "@/lib/configs/api-routes";
import {
  PRODUCT_IMAGES_FOLDER,
  UploadRequestInputSchema,
  UploadRequestResponseSchema,
  type UploadRequestResponse,
} from "@/types/storage";
import type { CreateProductImageInput } from "@/types/product-image";

/**
 * `["product-images"]` is the prefix of both the list and the detail keys, so
 * invalidating it refreshes the table *and* the open gallery — the newly added
 * image appears in both without either page knowing about the other.
 */
const invalidateKeys = [queryKeys.productImages.all] as const;

/** Product image mutations (create) plus its presigned-upload handshake. */
export function useProductImageMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, CreateProductImageInput>({
    mutationFn: (payload) =>
      axiosClient.post(API_ROUTES.PRODUCT_IMAGES.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product image added successfully!",
  });

  /**
   * Asks the backend for a short-lived, single-use presigned upload URL in the
   * `product-images` folder. The caller PUTs the file to `uploadUrl` and stores
   * the returned `publicUrl` as the image's URL.
   */
  const requestProductImageUpload = async (
    file: File
  ): Promise<UploadRequestResponse> => {
    const payload = UploadRequestInputSchema.parse({
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      folder: PRODUCT_IMAGES_FOLDER,
    });

    const response = await axiosClient.post(
      API_ROUTES.STORAGE.UPLOAD_REQUESTS,
      payload
    );
    return UploadRequestResponseSchema.parse(response.data);
  };

  return { create, requestProductImageUpload };
}
