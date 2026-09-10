"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { ColorFormInput } from "@/types/color";
import {
  SWATCH_IMAGES_FOLDER,
  UploadRequestInput,
  UploadRequestResponseSchema,
  type UploadRequestResponse,
} from "@/types/storage";

const invalidateKeys = [queryKeys.colors.all] as const;

export function useColorMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, ColorFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.COLORS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Color created successfully!",
  });

  /**
   * Asks the backend for a short-lived, single-use presigned upload URL for a
   * swatch image. The caller PUTs the file to `uploadUrl` and stores the
   * returned `publicUrl` as the color's swatch image URL.
   */
  const requestSwatchImageUpload = async (file: File): Promise<UploadRequestResponse> => {
    const payload: UploadRequestInput = {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      folder: SWATCH_IMAGES_FOLDER,
    };

    const response = await axiosClient.post(API_ROUTES.STORAGE.UPLOAD_REQUESTS, payload);
    return UploadRequestResponseSchema.parse(response.data);
  };

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.post(API_ROUTES.COLORS.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Color updated",
  });

  return { create, requestSwatchImageUpload, toggleActiveStatus };
}