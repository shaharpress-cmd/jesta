import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { needsProfileOnboarding } from "@/lib/utils";

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

      const { data: existing } = await supabase
        .from("profiles")
        .select("name, terms_accepted_at")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          name,
          avatar_url,
          verified_basic: true,
          last_seen_at: new Date().toISOString(),
        });
      } else {
        await supabase
          .from("profiles")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", data.user.id);
      }

      const profile = existing ?? { name, terms_accepted_at: null };
      if (needsProfileOnboarding(profile)) {
        return NextResponse.redirect(`${origin}/login?onboarding=1`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
