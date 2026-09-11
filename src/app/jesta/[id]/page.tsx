"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  Heart,
  Flag,
  Users,
  MessageCircle,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { Header } from "@/components/Header";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { SafetyBanner } from "@/components/SafetyBanner";
import { Avatar } from "@/components/Avatar";
import { ReportModal } from "@/components/ReportModal";
import { EmptyState, PageFrame } from "@/components/EmptyState";
import { DetailSkeleton } from "@/components/FeedSkeleton";
import { SessionModeChip } from "@/components/SessionModeChip";
import { useStore } from "@/lib/store";
import { CATEGORY_MAP, formatDistance, SAFETY } from "@/lib/categories";

export default function JestaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getJesta,
    getUser,
    offers,
    offerHelp,
    getOrCreateThread,
    currentUserId,
    submitReport,
    cloudReady,
    isLoggedIn,
  } = useStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [offered, setOffered] = useState(false);
  const [busy, setBusy] = useState(false);

  const jesta = getJesta(id);
  const author = jesta ? getUser(jesta.authorId) : undefined;
  const cat = jesta ? CATEGORY_MAP[jesta.category] : null;
  const loginNext = `/login?next=${encodeURIComponent(`/jesta/${id}`)}`;

  const helpers = useMemo(() => {
    if (!jesta) return [];
    return offers
      .filter((o) => o.jestaId === jesta.id)
      .map((o) => ({ offer: o, user: getUser(o.userId) }))
      .filter((x) => x.user);
  }, [jesta, offers, getUser]);

  const alreadyOffered =
    offered ||
    (!!jesta &&
      offers.some((o) => o.jestaId === jesta.id && o.userId === currentUserId));

  const isOwn = !!jesta && jesta.authorId === currentUserId;
  const showHelpBar = !!jesta && !isOwn;

  if (!cloudReady) {
    return (
      <PageFrame>
        <Header showBack backHref="/" showBell={false} title="ג׳סטה" />
        <DetailSkeleton />
      </PageFrame>
    );
  }

  if (!jesta || !cat || !author) {
    return (
      <PageFrame>
        <Header showBack backHref="/" showBell={false} title="ג׳סטה" />
        <div className="page-pad py-10">
          <EmptyState
            emoji="🔍"
            title="הג׳סטה לא נמצאה"
            body="ייתכן שהיא הוסרה או שהקישור ישן."
            primaryHref="/"
            primaryLabel="חזרה לבית"
            secondaryHref="/nearby"
            secondaryLabel="לידך"
          />
        </div>
      </PageFrame>
    );
  }

  const onOffer = async () => {
    if (!isLoggedIn) {
      router.push(loginNext);
      return;
    }
    setBusy(true);
    setOffered(true);
    try {
      await offerHelp(jesta.id);
      const thread = await getOrCreateThread(jesta.id, jesta.authorId);
      router.push(`/chat/${thread.id}`);
    } finally {
      setBusy(false);
    }
  };

  const onMessage = async () => {
    if (!isLoggedIn) {
      router.push(loginNext);
      return;
    }
    setBusy(true);
    try {
      if (!alreadyOffered) {
        await offerHelp(jesta.id);
        setOffered(true);
      }
      const thread = await getOrCreateThread(jesta.id, jesta.authorId);
      router.push(`/chat/${thread.id}`);
    } finally {
      setBusy(false);
    }
  };

  const openChatWithHelper = async (helperId: string) => {
    if (!isLoggedIn) {
      router.push(loginNext);
      return;
    }
    const thread = await getOrCreateThread(jesta.id, helperId);
    router.push(`/chat/${thread.id}`);
  };

  const primaryLabel = busy
    ? "רגע…"
    : !isLoggedIn
      ? "התחברות כדי לעזור"
      : alreadyOffered
        ? "המשך בצ׳אט"
        : "אני יכול/ה לעזור";

  return (
    <PageFrame>
      <Header showBack backHref="/" showBell showMenu={false} />

      <div
        className={`page-pad space-y-5 max-w-2xl mx-auto ${
          showHelpBar ? "pb-36" : "pb-10"
        }`}
      >
        <div className="flex justify-center">
          <SessionModeChip compact />
        </div>

        {!isLoggedIn && (
          <div className="rounded-3xl border border-coral/25 bg-coral-soft/70 px-4 py-3.5 text-center anim-enter">
            <p className="text-sm font-bold text-charcoal">
              רוצים להציע עזרה?
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-charcoal/80">
              התחברו כדי להציע עזרה או לשלוח הודעה — הכפתור למטה תמיד זמין.
            </p>
            <Link
              href={loginNext}
              className="mt-3 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-bold text-white shadow-sm touch-manipulation"
            >
              <LogIn className="h-4 w-4" />
              התחברות
            </Link>
          </div>
        )}

        <div className="flex justify-center anim-enter">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: `${cat.color}1F`, color: cat.color }}
          >
            <span>{cat.emoji}</span>
            {cat.shortLabel}
          </span>
        </div>

        <h1 className="text-2xl font-black text-charcoal text-center leading-snug px-2 anim-enter">
          {jesta.title}
        </h1>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={`/profile?u=${author.id}`}
            className="flex min-h-11 items-center gap-2 rounded-2xl px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/30"
          >
            <Avatar
              src={author.avatar}
              name={author.name}
              size="md"
              online={author.online}
            />
            <div>
              <p className="font-bold text-charcoal flex items-center gap-1">
                {author.name}
                {author.verified && (
                  <ShieldCheck className="h-4 w-4 text-sage" />
                )}
              </p>
              <p className="text-xs text-charcoal-muted">{SAFETY.verifiedLabel}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {author.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1 text-charcoal-muted">
              <MapPin className="h-4 w-4 text-coral/80" />
              {formatDistance(jesta.distanceM)}
              <span className="text-[10px] font-medium text-charcoal-muted/90">
                · לדוגמה
              </span>
            </span>
          </div>
        </div>

        <p className="text-charcoal/90 leading-relaxed text-[15px]">
          {jesta.description}
        </p>

        <MapPlaceholder
          label={`${jesta.locationLabel} · אזור לדוגמה`}
          className="h-44 w-full"
          pins={1}
        />

        {helpers.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-bold text-charcoal">
              <Users className="h-5 w-5 text-coral" />
              מי הציע עזרה
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {helpers.map(({ user }) =>
                user ? (
                  <div
                    key={user.id}
                    className="shrink-0 w-40 card-soft p-3.5 anim-enter"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-[10px] text-charcoal-muted flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          {user.rating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-charcoal-muted mb-2.5">
                      {formatDistance(user.distanceM ?? 0)} ממך
                    </p>
                    <button
                      type="button"
                      onClick={() => openChatWithHelper(user.id)}
                      className="btn-pressable flex w-full min-h-11 items-center justify-center gap-1 rounded-full border border-coral/35 bg-coral-soft/60 py-2 text-xs font-semibold text-coral"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      צ׳אט
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )}

        {showHelpBar && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-charcoal-muted hover:text-coral touch-manipulation"
            >
              <Flag className="h-4 w-4" />
              דווח
            </button>
          </div>
        )}

        <SafetyBanner variant="footer" className="justify-center" />
      </div>

      {showHelpBar && (
        <div className="fixed bottom-0 inset-x-0 z-50 mx-auto w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
          <div className="border-t border-charcoal/[0.06] bg-cream/97 backdrop-blur-md shadow-nav px-4 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={busy}
                onClick={() => void onOffer()}
                className="cta-coral !min-h-[3.25rem] text-[16px] shadow-fab"
              >
                {!isLoggedIn ? (
                  <LogIn className="h-5 w-5" />
                ) : alreadyOffered ? (
                  <MessageCircle className="h-5 w-5" />
                ) : (
                  <Heart className="h-5 w-5" fill="currentColor" />
                )}
                {primaryLabel}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void onMessage()}
                className="btn-outline-coral !min-h-12 sm:!w-auto sm:min-w-[10.5rem] sm:shrink-0"
              >
                <MessageCircle className="h-5 w-5" />
                שלח הודעה
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={(reason) => {
          void submitReport({
            jestaId: jesta.id,
            reportedUserId: jesta.authorId,
            reason,
          });
        }}
      />
    </PageFrame>
  );
}
