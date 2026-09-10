/**
 * Uploads a file to a short-lived presigned URL issued by the backend
 * (direct-to-cloud flow). No auth headers are attached — the signed URL is
 * self-contained and single-use.
 */
export async function uploadFileToPresignedUrl(signedUrl: string, file: File) {
  const response = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new Error(`File upload failed with status ${response.status}`);
  }
}