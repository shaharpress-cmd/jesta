import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const meta = data.user.user_metadata ?? {};
      const name =
        (meta.full_name as string) ||
        (meta.name as string) ||
        data.user.email?.split("@")[0] ||
        "משתמש Google";
      const avatar_url =
        (meta.avatar_url as string) || (meta.picture as string) || null;

      // Ensure profiles row exists (trigger may also insert)
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          name,
          avatar_url,
          verified_basic: true,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
