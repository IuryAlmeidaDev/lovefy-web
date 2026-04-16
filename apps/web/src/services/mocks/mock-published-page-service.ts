import {
  buildPublishedPageUrl,
  createSlug,
  type LovePage,
  type Surprise
} from "@lovefy/shared";
import { wait } from "./mock-utils";

export async function publishMockLovePage(surprise: Surprise): Promise<LovePage> {
  await wait(600);

  const slug = `${createSlug(surprise)}-${Date.now().toString(36)}`;
  const publishedUrl = buildPublishedPageUrl(slug);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...surprise,
    publishedUrl,
    qrCodeValue: publishedUrl,
    expiresAt
  };
}
