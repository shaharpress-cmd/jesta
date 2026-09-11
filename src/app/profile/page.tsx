"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Shield,
  Tag,
  BarChart3,
  Grid3X3,
  Clock,
  Heart,
  Box,
  LogIn,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { SafetyBanner } from "@/components/SafetyBanner";
import { PageFrame } from "@/components/EmptyState";
import { useStore } from "@/lib/store";
import { CATEGORY_MAP, SAFETY } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

const TAG_STYLES = [
  "bg-coral-soft text-coral-dark border border-coral/20",
  "bg-amberSoft text-amber-800/80 border border-amber-200/40",
  "bg-sage-soft text-sage border border-sage/25",
  "bg-cream text-charcoal-muted border border-charcoal/8",
  "bg-white text-charcoal border border-charcoal/8",
];

function ProfileInner() {
  const params = useSearchParams();
  const { currentUser, getUser, currentUserId, isDemoSession, isCloud } =
    useStore();
  const uid = params.get("u");
  const user = uid ? getUser(uid) ?? currentUser : currentUser;
  const isMe = user.id === currentUserId;

  const recent = useMemo(
    () => [
      {
        text: "עזרה לנועה להרים מקרר",
        when: "לפני יומיים",
        stars: 5,
      },
      {
        text: "עזרה בדלק ליד איילון",
        when: "לפני 4 ימים",
        stars: 5,
      },
      {
        text: "החזקת מדף לשכן",
        when: "לפני שבוע",
        stars: 4,
      },
    ],
    []
  );

  return (
    <PageFrame>
      <Header showBack={!isMe} backHref="/" showMenu={isMe} />

      <div className="page-pad space-y-5 pb-8 max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="xl"
              online={user.online}
              verified={user.verified}
            />
            {user.online && (
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-fit rounded-full bg-sage px-2 py-0.5 text-[10px] font-medium text-white whitespace-nowrap">
                פעיל עכשיו
              </span>
            )}
          </div>
          <div className="flex-1 pt-1">
            <h1 className="text-2xl font-black text-charcoal flex items-center gap-1.5">
              {user.name}
              {user.verified && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] text-white">
                  ✓
                </span>
              )}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{user.rating.toFixed(1)}</span>
              <span className="text-charcoal-muted">
                ({user.ratingCount} דירוגים)
              </span>
            </p>
            {user.verified && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-coral">
                <Shield className="h-4 w-4" />
                {SAFETY.verifiedLabel}
              </p>
            )}
            {user.bio && (
              <p className="mt-2 text-sm text-charcoal-muted">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-bold text-charcoal">
            <Tag className="h-4 w-4 text-coral" />
            תגים
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.tags.map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${TAG_STYLES[i % TAG_STYLES.length]}`}
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="card-soft p-4">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-charcoal">
            <BarChart3 className="h-4 w-4 text-coral" />
            סטטיסטיקה
          </h2>
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-charcoal/10 text-center">
            <div className="px-2">
              <Heart className="mx-auto h-5 w-5 text-coral mb-1" />
              <p className="text-xl font-black text-charcoal">
                {user.stats.given}
              </p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">
                ג׳סטות שניתנו
              </p>
            </div>
            <div className="px-2">
              <Box className="mx-auto h-5 w-5 text-coral mb-1" />
              <p className="text-xl font-black text-charcoal">
                {user.stats.requested}
              </p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">בקשות</p>
            </div>
            <div className="px-2">
              <Clock className="mx-auto h-5 w-5 text-coral mb-1" />
              <p className="text-xl font-black text-charcoal">
                {user.stats.avgResponseMin} דק׳
              </p>
              <p className="text-[10px] text-charcoal-muted mt-0.5">
                זמן תגובה ממוצע
              </p>
            </div>
          </div>
        </section>

        {/* Help categories */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-bold text-charcoal">
            <Grid3X3 className="h-4 w-4 text-coral" />
            קטגוריות עזרה
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {user.helpCategories.map((cid: CategoryId) => {
              const c = CATEGORY_MAP[cid];
              return (
                <div
                  key={cid}
                  className="flex w-20 shrink-0 flex-col items-center gap-1.5"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                    style={{ backgroundColor: `${c.color}22` }}
                  >
                    {c.emoji}
                  </span>
                  <span className="text-[10px] text-center text-charcoal-muted leading-tight">
                    {c.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-bold text-charcoal">
            <Clock className="h-4 w-4 text-coral" />
            פעילות אחרונה
          </h2>
          <div className="space-y-2">
            {recent.map((r) => (
              <div
                key={r.text}
                className="flex items-center gap-3 card-soft p-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {r.text}
                  </p>
                  <p className="text-xs text-charcoal-muted mt-0.5">{r.when}</p>
                </div>
                <span className="flex items-center gap-0.5 text-sm font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                  {r.stars}
                </span>
              </div>
            ))}
          </div>
        </section>

        {isMe && (
          <section className="card-soft p-4 space-y-3">
            <h2 className="flex items-center gap-2 font-bold text-charcoal">
              <LogIn className="h-4 w-4 text-coral" />
              חשבון
            </h2>
            <p className="text-xs text-charcoal-muted">
              {isDemoSession
                ? "מצב דמו — לא חשבון Google חי. להתחברות אמיתית בחרו Google במסך ההתחברות."
                : isCloud
                  ? "חשבון Google"
                  : "התחברות עם Google · מצב דמו זמין לבדיקות"}
            </p>
            <Link
              href="/login"
              className="cta-coral !py-3 text-sm"
            >
              {isDemoSession
                ? "מצב דמו · התחברות עם Google"
                : "התחברות / החלפת חשבון"}
            </Link>
          </section>
        )}

        <SafetyBanner variant="footer" className="justify-center" />
      </div>
    </PageFrame>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">טוען...</div>}>
      <ProfileInner />
    </Suspense>
  );
}
