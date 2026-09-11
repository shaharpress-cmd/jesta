"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { useStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/categories";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const {
    threads,
    messages,
    getUser,
    getJesta,
    currentUserId,
  } = useStore();

  const sorted = [...threads].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() -
      new Date(a.lastMessageAt).getTime()
  );

  return (
    <div>
      <Header title="הודעות" showBell={false} />

      <div className="page-pad space-y-2.5 max-w-2xl mx-auto">
        {sorted.length === 0 ? (
          <div className="card-soft p-10 text-center mt-4">
            <p className="text-4xl mb-2">💬</p>
            <p className="font-medium">אין הודעות עדיין</p>
            <p className="text-sm text-charcoal-muted mt-1">
              הציעו עזרה בג׳סטה כדי להתחיל שיחה
            </p>
          </div>
        ) : (
          sorted.map((t) => {
            const otherId = t.participantIds.find((p) => p !== currentUserId)!;
            const other = getUser(otherId);
            const jesta = getJesta(t.jestaId);
            const last = [...messages]
              .filter((m) => m.threadId === t.id)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )[0];

            if (!other) return null;

            return (
              <Link
                key={t.id}
                href={`/chat/${t.id}`}
                className="flex items-center gap-3.5 card-soft p-4 transition hover:border-coral/15"
              >
                <Avatar
                  src={other.avatar}
                  name={other.name}
                  size="md"
                  online={other.online}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-charcoal truncate">
                      {other.name}
                    </p>
                    <span className="text-[10px] text-charcoal-muted shrink-0">
                      {formatRelativeTime(t.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted truncate mt-0.5">
                    {jesta?.title}
                  </p>
                  <p
                    className={cn(
                      "text-sm truncate mt-0.5",
                      t.unreadCount > 0
                        ? "font-semibold text-charcoal"
                        : "text-charcoal-muted"
                    )}
                  >
                    {last?.text ?? "התחילו שיחה"}
                  </p>
                </div>
                {t.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">
                    {t.unreadCount}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
