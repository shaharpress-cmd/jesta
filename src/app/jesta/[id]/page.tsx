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
} from "lucide-react";
import { Header } from "@/components/Header";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { SafetyBanner } from "@/components/SafetyBanner";
import { Avatar } from "@/components/Avatar";
import { ReportModal } from "@/components/ReportModal";
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
  } = useStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [offered, setOffered] = useState(false);

  const jesta = getJesta(id);
  const author = jesta ? getUser(jesta.authorId) : undefined;
  const cat = jesta ? CATEGORY_MAP[jesta.category] : null;

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

  if (!jesta || !cat || !author) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-charcoal font-medium">הג׳סטה לא נמצאה</p>
        <Link href="/" className="mt-4 inline-block text-coral">
          חזרה לבית
        </Link>
      </div>
    );
  }

  const onOffer = async () => {
    setOffered(true);
    await offerHelp(jesta.id);
    const thread = await getOrCreateThread(jesta.id, jesta.authorId);
    router.push(`/chat/${thread.id}`);
  };

  const openChatWithHelper = async (helperId: string) => {
    const thread = await getOrCreateThread(jesta.id, helperId);
    router.push(`/chat/${thread.id}`);
  };

  return (
    <div>
      <Header showBack backHref="/" showBell showMenu={false} />

      <div className="px-4 space-y-5 pb-10">
        <div className="flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: `${cat.color}1F`, color: cat.color }}
          >
            <span>{cat.emoji}</span>
            {cat.shortLabel}
          </span>
        </div>

        <h1 className="text-2xl font-black text-charcoal text-center leading-snug px-2">
          {jesta.title}
        </h1>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={`/profile?u=${author.id}`}
            className="flex items-center gap-2"
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
            </span>
          </div>
        </div>

        <p className="text-charcoal/90 leading-relaxed text-[15px]">
          {jesta.description}
        </p>

        <MapPlaceholder
          label={jesta.locationLabel}
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
                    className="shrink-0 w-40 card-soft p-3.5"
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
                      className="flex w-full items-center justify-center gap-1 rounded-full border border-coral/35 bg-coral-soft/60 py-2 text-xs font-semibold text-coral"
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

        {jesta.authorId !== currentUserId && (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (alreadyOffered) {
                  void (async () => {
                    const thread = await getOrCreateThread(
                      jesta.id,
                      jesta.authorId
                    );
                    router.push(`/chat/${thread.id}`);
                  })();
                } else {
                  void onOffer();
                }
              }}
              className="cta-coral"
            >
              {alreadyOffered ? (
                <MessageCircle className="h-5 w-5" />
              ) : (
                <Heart className="h-5 w-5" fill="currentColor" />
              )}
              {alreadyOffered ? "צ׳אט" : "אני יכול לעזור"}
            </button>
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="btn-outline-coral"
            >
              <Flag className="h-5 w-5" />
              דווח
            </button>
          </div>
        )}

        <SafetyBanner variant="footer" className="justify-center" />
      </div>

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
    </div>
  );
}
