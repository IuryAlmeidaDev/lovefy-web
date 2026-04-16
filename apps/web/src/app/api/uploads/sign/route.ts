import { NextResponse, type NextRequest } from "next/server";
import { verifyDraftToken } from "@/lib/uploads/draft-token";
import { checkRateLimit } from "@/lib/uploads/rate-limit";
import {
  createStoragePath,
  uploadPolicy,
  validateImageForUpload
} from "@/lib/uploads/upload-policy";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

type SignUploadBody = {
  draftId?: string;
  draftToken?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
};

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for real uploads yet." },
      { status: 501 }
    );
  }

  const rateLimit = checkRateLimit({
    key: `upload:${getClientIp(request)}`,
    limit: 30,
    windowMs: 60 * 60 * 1000
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Muitos uploads em pouco tempo. Tente novamente em alguns minutos." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as SignUploadBody;
  const validation = validateRequest(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: draft, error: draftError } = await supabase
    .from("lovefy_drafts")
    .select("id, token_hash, status")
    .eq("id", body.draftId)
    .single();

  if (draftError || !draft) {
    return NextResponse.json({ error: "Rascunho nao encontrado." }, { status: 404 });
  }

  if (draft.status !== "draft") {
    return NextResponse.json(
      { error: "Este rascunho nao aceita novos uploads." },
      { status: 409 }
    );
  }

  if (!verifyDraftToken(body.draftToken!, draft.token_hash)) {
    return NextResponse.json({ error: "Token do rascunho invalido." }, { status: 403 });
  }

  const { count, error: countError } = await supabase
    .from("lovefy_photos")
    .select("id", { count: "exact", head: true })
    .eq("draft_id", body.draftId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count || 0) >= uploadPolicy.maxPhotosPerDraft) {
    return NextResponse.json(
      { error: `Limite de ${uploadPolicy.maxPhotosPerDraft} fotos por cartinha.` },
      { status: 409 }
    );
  }

  const photoId = crypto.randomUUID();
  const path = createStoragePath(body.draftId!, photoId);
  const { data: signedUpload, error: signedUploadError } = await supabase.storage
    .from(uploadPolicy.bucket)
    .createSignedUploadUrl(path);

  if (signedUploadError) {
    return NextResponse.json({ error: signedUploadError.message }, { status: 500 });
  }

  const { error: photoError } = await supabase.from("lovefy_photos").insert({
    id: photoId,
    draft_id: body.draftId,
    storage_path: path,
    original_file_name: body.fileName,
    mime_type: uploadPolicy.outputMimeType,
    size_bytes: body.sizeBytes
  });

  if (photoError) {
    return NextResponse.json({ error: photoError.message }, { status: 500 });
  }

  return NextResponse.json({
    photoId,
    path,
    token: signedUpload.token
  });
}

function validateRequest(body: SignUploadBody) {
  if (!body.draftId || !body.draftToken) {
    return { ok: false, reason: "Rascunho invalido." } as const;
  }

  if (!body.fileName || !body.mimeType || typeof body.sizeBytes !== "number") {
    return { ok: false, reason: "Dados do arquivo incompletos." } as const;
  }

  return validateImageForUpload({
    mimeType: body.mimeType,
    sizeBytes: body.sizeBytes
  });
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
