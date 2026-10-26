"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type {
  CollectionFormInput,
  CollectionUpdateInput,
} from "@/types/collection";
import {
  COLLECTION_COVER_IMAGES_FOLDER,
  UploadRequestInput,
  UploadRequestResponseSchema,
  type UploadRequestResponse,
} from "@/types/storage";

const invalidateKeys = [queryKeys.collections.all] as const;

/** All collection mutations (create, update + the cover presigned-upload flow). */
export function useCollectionMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, CollectionFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.COLLECTIONS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Collection created successfully!",
  });

  /**
   * Asks the backend for a short-lived, single-use presigned upload URL for a
   * collection cover image. The caller PUTs the file to `signedUrl` and stores
   * the returned `publicUrl` as the collection's `imageUrl`.
   */
  const requestCoverUpload = async (file: File): Promise<UploadRequestResponse> => {
    const payload: UploadRequestInput = {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      folder: COLLECTION_COVER_IMAGES_FOLDER,
    };

    const response = await axiosClient.post(API_ROUTES.STORAGE.UPLOAD_REQUESTS, payload);
    return UploadRequestResponseSchema.parse(response.data);
  };

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.patch(API_ROUTES.COLLECTIONS.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Collection updated",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.COLLECTIONS.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Collection deleted successfully!",
  });

  /**
   * Edits a collection's own record (name, description, cover). Distinct from
   * the item routes — this never touches the products inside it.
   */
  const update = useAppMutation<void, { id: string; payload: CollectionUpdateInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.patch(API_ROUTES.COLLECTIONS.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Collection updated successfully!",
  });

  /**
   * Links one product to a collection
   * (`POST /api/v1/collections/{collectionId}/items/{productId}`).
   *
   * The backend is idempotent — linking an already-linked product returns the
   * existing row instead of failing — which is why the picker hides products
   * that are already in the collection rather than relying on an error.
   */
  const addItem = useAppMutation<void, { collectionId: string; productId: string }>({
    mutationFn: ({ collectionId, productId }) =>
      axiosClient
        .post(API_ROUTES.COLLECTIONS.ITEM(collectionId, productId))
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product added to collection!",
  });

  /**
   * Removes one product from a collection
   * (`DELETE /api/v1/collections/{collectionId}/items/{productId}`).
   */
  const removeItem = useAppMutation<void, { collectionId: string; productId: string }>({
    mutationFn: ({ collectionId, productId }) =>
      axiosClient
        .delete(API_ROUTES.COLLECTIONS.ITEM(collectionId, productId))
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Product removed from collection!",
  });

  return { create, requestCoverUpload, toggleActiveStatus, remove, update, addItem, removeItem };
}
