import { wait } from "./mock-utils";

export async function simulatePhotoStorage(files: File[]) {
  await wait(500);

  return files.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    previewUrl: URL.createObjectURL(file)
  }));
}
