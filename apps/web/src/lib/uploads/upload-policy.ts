export const uploadPolicy = {
  bucket: process.env.SUPABASE_STORAGE_BUCKET || "lovefy-photos",
  maxPhotosPerDraft: 6,
  maxOriginalFileBytes: 5 * 1024 * 1024,
  maxCompressedFileBytes: 2 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  outputMimeType: "image/webp",
  outputExtension: "webp",
  signedUploadTtlSeconds: 60 * 30,
  draftTtlHours: 24,
  publishedPageTtlDays: 30,
  maxImageDimension: 1600
} as const;

export type UploadPolicy = typeof uploadPolicy;

export type UploadValidationInput = {
  mimeType: string;
  sizeBytes: number;
};

export function validateImageForUpload(input: UploadValidationInput) {
  if (!uploadPolicy.allowedMimeTypes.some((mimeType) => mimeType === input.mimeType)) {
    return {
      ok: false,
      reason: "Formato invalido. Envie imagens JPG, PNG ou WebP."
    } as const;
  }

  if (input.sizeBytes <= 0) {
    return {
      ok: false,
      reason: "Arquivo vazio ou invalido."
    } as const;
  }

  if (input.sizeBytes > uploadPolicy.maxOriginalFileBytes) {
    return {
      ok: false,
      reason: "Imagem muito grande. O limite e 5 MB por foto."
    } as const;
  }

  return { ok: true } as const;
}

export function createStoragePath(draftId: string, photoId = crypto.randomUUID()) {
  return `drafts/${draftId}/${photoId}.${uploadPolicy.outputExtension}`;
}
