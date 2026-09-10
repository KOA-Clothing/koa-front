import { z } from "zod";

export const SIZE_GUIDE_FOLDER = "size-guides";

export const UploadRequestInputSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  contentType: z.string().min(1, "Content type is required"),
  fileSize: z.number().int().positive(),
  folder: z.string().min(1).optional(),
});

export type UploadRequestInput = z.infer<typeof UploadRequestInputSchema>;

export const UploadRequestResponseSchema = z.object({
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  filePath: z.string().min(1),
});

export type UploadRequestResponse = z.infer<typeof UploadRequestResponseSchema>;