"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { CategoryFormInput } from "@/types/category";
import {
  SIZE_GUIDE_FOLDER,
  UploadRequestInput,
  UploadRequestResponseSchema,
  type UploadRequestResponse,
} from "@/types/storage";

const invalidateKeys = [queryKeys.categories.all] as const;

/** All category mutations (create + the size-guide presigned-upload flow). */
export function useCategoryMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, CategoryFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.CATEGORIES.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Category created successfully!",
  });

  /**
   * Asks the backend for a short-lived, single-use presigned upload URL for a
   * size guide image. The caller PUTs the file to `signedUrl` and stores the
   * returned `publicUrl` as the category's size guide URL.
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
      axiosClient.post(API_ROUTES.CATEGORIES.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Category updated",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.CATEGORIES.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Category deleted successfully!",
  });

  const update = useAppMutation<void, { id: string; payload: CategoryFormInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(API_ROUTES.CATEGORIES.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Category updated successfully!",
  });

  return { create, requestSizeGuideUpload, toggleActiveStatus, remove, update };
}