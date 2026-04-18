import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { uploadPolicy } from "@/lib/uploads/upload-policy";

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for cleanup." },
      { status: 501 }
    );
  }

  const supabase = getSupabaseAdmin();
  const draftCutoff = new Date(
    Date.now() - uploadPolicy.draftTtlHours * 60 * 60 * 1000
  ).toISOString();
  const now = new Date().toISOString();
  const { data: expiredDrafts, error } = await supabase
    .from("lovefy_drafts")
    .select("id")
    .or(`and(status.eq.draft,created_at.lt.${draftCutoff}),and(status.eq.published,expires_at.lt.${now})`)
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const draft of expiredDrafts || []) {
    await removeDraftStorageFolder(draft.id);
  }

  const ids = (expiredDrafts || []).map((draft) => draft.id);

  if (ids.length) {
    await supabase.from("lovefy_photos").delete().in("draft_id", ids);
    await supabase.from("lovefy_drafts").delete().in("id", ids);
  }

  return NextResponse.json({
    ok: true,
    removedDrafts: ids.length
  });
}

async function removeDraftStorageFolder(draftId: string) {
  const supabase = getSupabaseAdmin();
  const prefix = `drafts/${draftId}`;
  const { data: files } = await supabase.storage.from(uploadPolicy.bucket).list(prefix);

  if (!files?.length) return;

  await supabase.storage
    .from(uploadPolicy.bucket)
    .remove(files.map((file) => `${prefix}/${file.name}`));
}
