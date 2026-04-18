import { uploadPolicy, validateImageForUpload } from "./upload-policy";

export async function compressImageToWebp(file: File) {
  const validation = validateImageForUpload({
    mimeType: file.type,
    sizeBytes: file.size
  });

  if (!validation.ok) {
    throw new Error(validation.reason);
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    uploadPolicy.maxImageDimension / Math.max(bitmap.width, bitmap.height)
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Nao foi possivel preparar a imagem no navegador.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, uploadPolicy.outputMimeType, 0.82);
  });

  if (!blob) {
    throw new Error("Nao foi possivel converter a imagem para WebP.");
  }

  if (blob.size > uploadPolicy.maxCompressedFileBytes) {
    throw new Error("Imagem muito grande mesmo apos compressao. Tente outra foto.");
  }

  return new File([blob], replaceExtension(file.name), {
    type: uploadPolicy.outputMimeType
  });
}

function replaceExtension(fileName: string) {
  return `${fileName.replace(/\.[^.]+$/, "") || "foto"}.${uploadPolicy.outputExtension}`;
}
