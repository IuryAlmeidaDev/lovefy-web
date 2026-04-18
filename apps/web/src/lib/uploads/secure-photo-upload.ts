import { createClient } from "@supabase/supabase-js";
import { type Photo } from "@lovefy/shared";
import { compressImageToWebp } from "./client-image";

const DRAFT_SESSION_KEY = "lovefy:draft-session";

type DraftSession = {
  draftId: string;
  draftToken: string;
};

type SignedUploadResponse = {
  photoId: string;
  path: string;
  token: string;
};

export async function uploadPhotosSecurely(files: File[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase client environment variables are not configured.");
  }

  const session = await getOrCreateDraftSession();
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const photos: Photo[] = [];

  for (const originalFile of files) {
    const file = await compressImageToWebp(originalFile);
    const signedUpload = await requestSignedUpload(session, file);
    const { error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "lovefy-photos")
      .uploadToSignedUrl(signedUpload.path, signedUpload.token, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    photos.push({
      id: signedUpload.photoId,
      name: file.name,
      previewUrl: URL.createObjectURL(file)
    });
  }

  return photos;
}

async function getOrCreateDraftSession() {
  const existing = window.localStorage.getItem(DRAFT_SESSION_KEY);

  if (existing) {
    return JSON.parse(existing) as DraftSession;
  }

  const response = await fetch("/api/drafts", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel criar o rascunho anonimo.");
  }

  const session = (await response.json()) as DraftSession;
  window.localStorage.setItem(DRAFT_SESSION_KEY, JSON.stringify(session));

  return session;
}

async function requestSignedUpload(session: DraftSession, file: File) {
  const response = await fetch("/api/uploads/sign", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      draftId: session.draftId,
      draftToken: session.draftToken,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size
    })
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Nao foi possivel liberar o upload da foto.");
  }

  return response.json() as Promise<SignedUploadResponse>;
}
