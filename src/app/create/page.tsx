"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Pencil, Zap, Calendar, Clock, ArrowLeft, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryPills } from "@/components/CategoryPills";
import { SafetyBanner } from "@/components/SafetyBanner";
import { CreateCategoryTips } from "@/components/CreateCategoryTips";
import { PageFrame } from "@/components/EmptyState";
import { JestiBuddy } from "@/components/JestiBuddy";
import { useStore } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { CategoryId, Urgency } from "@/lib/types";
import { TIP_BY_ID } from "@/lib/tips";
import { cn } from "@/lib/utils";

const URGENCY: { id: Urgency; label: string; icon: typeof Zap }[] = [
  { id: "now", label: "עכשיו", icon: Zap },
  { id: "today", label: "היום", icon: Calendar },
  { id: "flexible", label: "גמיש", icon: Clock },
];

const VALID_IDS = new Set(Object.keys(TIP_BY_ID));

function createErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (
    raw === "CLOUD_NOT_READY" ||
    raw === "SESSION_NOT_SYNCED" ||
    /JWT|RLS|row-level|policy|author/i.test(raw)
  ) {
    return "עדיין מסנכרנים את החשבון. המתינו רגע ונסו שוב.";
  }
  return "לא הצלחנו לפרסם את הג׳סטה. נסו שוב בעוד רגע.";
}

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createJesta, cloudReady, storeReady, isLoggedIn } = useStore();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("fuel");
  const [location, setLocation] = useState("תל אביב, אזור איילון");
  const [urgency, setUrgency] = useState<Urgency>("now");
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const waitingForCloud = isSupabaseConfigured() && !cloudReady;

  useEffect(() => {
    const raw = searchParams.get("category");
    if (raw && VALID_IDS.has(raw)) {
      setCategory(raw as CategoryId);
    }
  }, [searchParams]);

  const canSubmit =
    description.trim().length >= 8 &&
    location.trim().length > 0 &&
    !waitingForCloud &&
    !published;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isSupabaseConfigured() && !cloudReady) {
        throw new Error("CLOUD_NOT_READY");
      }
      const title =
        description.trim().length > 40
          ? description.trim().slice(0, 40) + "…"
          : description.trim();
      const j = await createJesta({
        title,
        description: description.trim(),
        category,
        locationLabel: location.trim(),
        urgency,
      });
      setPublished(true);
      setSubmitting(false);
      window.setTimeout(() => {
        router.push(`/jesta/${j.id}`);
      }, 720);
    } catch (e) {
      console.error(e);
      setError(createErrorMessage(e));
      setSubmitting(false);
    }
  };

  if (waitingForCloud || !storeReady) {
    return (
      <PageFrame>
        <Header
          title="בקשת ג׳סטה"
          showBack
          backHref="/"
          showBell={false}
          showMenu={false}
        />
        <div className="page-pad py-16 text-center space-y-4 max-w-sm mx-auto">
          <div
            className="mx-auto h-10 w-10 rounded-full border-2 border-coral/30 border-t-coral animate-spin"
            aria-hidden
          />
          <div className="space-y-2">
            <p className="text-base font-bold text-charcoal">
              {isLoggedIn ? "מסנכרנים את החשבון…" : "מכינים את טופס הפרסום…"}
            </p>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              {isLoggedIn
                ? "רגע קטן אחרי ההתחברות — ואז אפשר לפרסם בשקט."
                : "אם זה לוקח יותר מדי, התחברו ואז חזרו לפרסום."}
            </p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal/[0.08]">
            <div className="h-full w-2/5 rounded-full bg-coral/80 animate-pulse" />
          </div>
          {!isLoggedIn && (
            <Link
              href="/login?next=/create"
              className="btn-pressable inline-flex min-h-12 items-center justify-center rounded-full bg-coral px-6 text-sm font-bold text-white shadow-soft"
            >
              התחברות כדי לפרסם
            </Link>
          )}
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <Header title="בקשת ג׳סטה" showBack backHref="/" showBell={false} showMenu={false} />

      <div className="page-pad space-y-5 pb-4 max-w-xl mx-auto">
        {published ? (
          <div
            role="status"
            className="anim-success card-soft flex items-center gap-3 border-sage/30 bg-sage-soft/50 p-4"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-white shadow-sm">
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-charcoal">פורסם!</p>
              <p className="text-xs text-charcoal-muted">מעבירים לכרטיס הג׳סטה…</p>
            </div>
            <JestiBuddy variant="cheer" size="sm" label="כל הכבוד" hold />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-charcoal-muted leading-relaxed">
              ספרו מה צריך — נחפש יחד מי יכול לעזור.
            </p>
            <JestiBuddy variant="seek" size="sm" label="מחפשים יחד" hold />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            מה צריך?
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              rows={4}
              placeholder="ספרו לנו במה אפשר לעזור..."
              className="input-soft w-full p-4 resize-none min-h-[7.5rem]"
              disabled={published}
            />
            <Pencil className="absolute bottom-3.5 end-3.5 h-4 w-4 text-charcoal-light" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            קטגוריה:
          </label>
          <CategoryPills
            selected={category}
            onSelect={(id) => {
              if (id !== "all") setCategory(id);
            }}
            showAll={false}
            compact
          />
        </div>

        <CreateCategoryTips category={category} />

        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            איפה:
          </label>
          <div className="flex items-center gap-2 input-soft px-4 py-3.5 min-h-12">
            <MapPin className="h-5 w-5 text-coral/80 shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
              disabled={published}
            />
          </div>
          <p className="mt-1.5 text-xs text-charcoal-muted">
            העדיפו אזור כללי — לא כתובת מדויקת
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            מתי:
          </label>
          <div className="flex gap-2">
            {URGENCY.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setUrgency(id)}
                disabled={published}
                className={cn(
                  urgency === id ? "chip-active" : "chip-inactive",
                  "flex-1"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <SafetyBanner variant="tip" />

        {error && (
          <div
            role="alert"
            className="anim-enter rounded-2xl border border-coral/25 bg-coral-soft/60 px-4 py-3 text-sm text-charcoal leading-relaxed"
          >
            {error}
          </div>
        )}

        <div className="sticky-cta">
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={onSubmit}
            className={cn("cta-coral", canSubmit && !submitting && !published && "cta-pulse")}
          >
            {published ? (
              <>
                <Check className="h-5 w-5" />
                פורסם
              </>
            ) : submitting ? (
              "מפרסמים…"
            ) : (
              <>
                פרסם ג׳סטה
                <ArrowLeft className="h-5 w-5" />
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs text-charcoal-muted px-2 leading-relaxed">
            בפרסום אתם מאשרים שזו עזרה לא-מקצועית. ג׳סטה מתווכת בלבד.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh">
          <Header title="בקשת ג׳סטה" showBack backHref="/" showBell={false} showMenu={false} />
          <div className="page-pad py-8 text-sm text-charcoal-muted">טוען…</div>
        </div>
      }
    >
      <CreateForm />
    </Suspense>
  );
}
