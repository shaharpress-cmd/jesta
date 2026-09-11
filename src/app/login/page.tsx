"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { SafetyBanner } from "@/components/SafetyBanner";
import { useStore } from "@/lib/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Step = "auth" | "onboarding";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const {
    users,
    currentUserId,
    currentUser,
    signInWithGoogle,
    signInAsDemo,
    completeOnboarding,
  } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>("auth");
  const [displayName, setDisplayName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const seedUsers = useMemo(
    () => users.filter((u) => u.id !== "u-google"),
    [users]
  );

  const handleGoogle = async () => {
    setBusy(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const origin = window.location.origin;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${origin}/auth/callback` },
        });
        if (error) {
          console.error("Google OAuth error:", error.message);
          setBusy(false);
        }
        // Browser navigates to Google; no local stub step.
        return;
      }

      // Stub when Supabase env vars are not set yet
      const user = signInWithGoogle();
      setDisplayName(user.name === "משתמש Google" ? "" : user.name);
      setAccepted(Boolean(user.acceptedTermsAt));
      setStep("onboarding");
    } finally {
      setBusy(false);
    }
  };

  const handleContinueAsDemo = () => {
    signInAsDemo("u-me");
    router.push("/");
  };

  const handleDemoPick = (id: string) => {
    signInAsDemo(id);
    router.push("/");
  };

  const handleStart = async () => {
    if (!accepted) return;
    await completeOnboarding({
      displayName: displayName.trim() || "משתמש Google",
      acceptedTerms: true,
    });
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100dvh-0px)] flex flex-col">
      <Header
        title={step === "auth" ? "התחברות" : "כמעט שם"}
        showBack
        backHref="/profile"
        showBell={false}
        showMenu={false}
      />

      <div className="flex-1 px-5 pb-8 flex flex-col">
        {step === "auth" ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center text-center pt-6 pb-10">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-coral-soft shadow-card">
                <span className="text-4xl" aria-hidden>
                  🤝
                </span>
              </div>
              <h1 className="text-3xl font-black text-coral tracking-tight">
                ג׳סטה
              </h1>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-charcoal-muted">
                עזרה שכנית, בלי תשלומים.
                <br />
                התחברו בשקט והמשיכו.
              </p>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={busy}
                className="mt-10 flex w-full max-w-sm items-center justify-center gap-3 rounded-3xl bg-white border border-charcoal/[0.08] py-4 px-5 text-base font-bold text-charcoal shadow-card transition active:scale-[0.99] hover:border-coral/25 disabled:opacity-50"
              >
                <GoogleMark className="h-5 w-5 shrink-0" />
                המשך עם Google
              </button>

              <p className="mt-5 max-w-xs text-[11px] leading-relaxed text-charcoal-light">
                אופציונלי בהמשך — לא אימייל/סיסמה, לא SMS.
                <br />
                {isSupabaseConfigured()
                  ? "התחברות עם Google דרך Supabase."
                  : "כרגע מדובר בסימולציה (בלי מפתחות OAuth)."}
              </p>

              <button
                type="button"
                onClick={handleContinueAsDemo}
                className="mt-8 text-xs text-charcoal-light underline-offset-4 hover:text-coral hover:underline"
              >
                המשך כדמו
              </button>
            </div>

            <div className="mt-auto border-t border-charcoal/[0.06] pt-4">
              <button
                type="button"
                onClick={() => setDemoOpen((v) => !v)}
                className="flex w-full items-center justify-center gap-1.5 text-[11px] text-charcoal-light"
              >
                מצב דמו
                {demoOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {demoOpen && (
                <div className="mt-3 space-y-2">
                  <p className="text-center text-[10px] text-charcoal-light mb-2">
                    בחירת משתמשי seed לבדיקות
                  </p>
                  {seedUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleDemoPick(u.id)}
                      className={`flex w-full items-center gap-3 card-soft p-3 text-right transition hover:border-coral/20 ${
                        u.id === currentUserId ? "ring-2 ring-coral/40" : ""
                      }`}
                    >
                      <Avatar
                        src={u.avatar}
                        name={u.name}
                        size="md"
                        online={u.online}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-charcoal">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">
                          ⭐ {u.rating.toFixed(1)} · {u.stats.given} ג׳סטות
                        </p>
                      </div>
                      {u.id === currentUserId && (
                        <span className="text-[10px] font-medium text-coral">
                          פעיל
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <SafetyBanner variant="footer" className="justify-center mt-4" />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col pt-4">
            <div className="card-soft p-5 space-y-5">
              <div className="text-center">
                <Avatar
                  src={currentUser.avatar}
                  name={displayName || currentUser.name}
                  size="xl"
                  className="mx-auto"
                />
                <h2 className="mt-4 text-lg font-bold text-charcoal">
                  איך לקרוא לך?
                </h2>
                <p className="mt-1 text-xs text-charcoal-muted">
                  שלב אופציונלי — אפשר לשנות אחר כך בפרופיל
                </p>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">
                  שם תצוגה
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="למשל: נועה"
                  className="input-soft w-full px-4 py-3.5"
                  autoFocus
                />
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-charcoal/20 text-coral focus:ring-coral/30 accent-coral"
                />
                <span className="text-sm leading-relaxed text-charcoal-muted">
                  אני מקבל/ת את{" "}
                  <span className="font-medium text-charcoal">תנאי השימוש</span>{" "}
                  ואת{" "}
                  <span className="font-medium text-charcoal">
                    מדיניות הפרטיות
                  </span>
                </span>
              </label>

              <button
                type="button"
                onClick={handleStart}
                disabled={!accepted}
                className="cta-coral"
              >
                בואו נתחיל
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep("auth")}
              className="mt-6 text-center text-xs text-charcoal-light hover:text-coral"
            >
              חזרה להתחברות
            </button>

            <SafetyBanner variant="footer" className="justify-center mt-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
