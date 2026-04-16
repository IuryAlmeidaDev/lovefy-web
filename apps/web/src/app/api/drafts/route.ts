import { NextResponse, type NextRequest } from "next/server";
import { createDraftToken, hashDraftToken } from "@/lib/uploads/draft-token";
import { checkRateLimit } from "@/lib/uploads/rate-limit";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for real uploads yet." },
      { status: 501 }
    );
  }

  const rateLimit = checkRateLimit({
    key: `draft:${getClientIp(request)}`,
    limit: 12,
    windowMs: 60 * 60 * 1000
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 }
    );
  }

  const supabase = getSupabaseAdmin();
  const draftToken = createDraftToken();
  const { data, error } = await supabase
    .from("lovefy_drafts")
    .insert({
      token_hash: hashDraftToken(draftToken),
      status: "draft"
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    draftId: data.id,
    draftToken
  });
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
