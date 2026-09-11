"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  MapPin,
  CheckCircle2,
  CheckCheck,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { SafetyBanner } from "@/components/SafetyBanner";
import { useStore } from "@/lib/store";
import { SAFETY } from "@/lib/categories";
import { cn, formatTime } from "@/lib/utils";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const {
    threads,
    messages,
    getUser,
    currentUserId,
    sendMessage,
    getJesta,
  } = useStore();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const thread = threads.find((t) => t.id === id);
  const otherId = thread?.participantIds.find((p) => p !== currentUserId);
  const other = otherId ? getUser(otherId) : undefined;
  const jesta = thread ? getJesta(thread.jestaId) : undefined;

  const threadMessages = useMemo(
    () =>
      messages
        .filter((m) => m.threadId === id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
    [messages, id]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.length]);

  if (!thread || !other) {
    return (
      <div className="px-4 py-20 text-center">
        <p>השיחה לא נמצאה</p>
        <Link href="/messages" className="text-coral mt-2 inline-block">
          להודעות
        </Link>
      </div>
    );
  }

  const onSend = () => {
    if (!text.trim()) return;
    sendMessage(thread.id, text);
    setText("");
  };

  return (
    <div className="fixed inset-0 z-[60] mx-auto flex max-w-md flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-charcoal/[0.05] bg-white/95 px-3 py-3 backdrop-blur">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Avatar
          src={other.avatar}
          name={other.name}
          size="md"
          online={other.online}
          verified={other.verified}
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-charcoal truncate">{other.name}</p>
          <p className="text-xs text-charcoal-muted flex items-center gap-1">
            {other.verified && (
              <span className="text-coral">{SAFETY.verifiedLabel}</span>
            )}
            {other.verified && <span>•</span>}
            <span
              className={cn(
                "inline-flex items-center gap-1",
                other.online && "text-sage"
              )}
            >
              {other.online && (
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              )}
              {other.online ? "פעיל עכשיו" : other.lastActive}
            </span>
          </p>
        </div>
        <button type="button" className="p-2 text-charcoal-muted" aria-label="שיחה">
          <Phone className="h-5 w-5" />
        </button>
        <button type="button" className="p-2 text-charcoal-muted" aria-label="עוד">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 py-2">
        <SafetyBanner variant="chat" />
        {jesta && (
          <Link
            href={`/jesta/${jesta.id}`}
            className="mt-2 block rounded-2xl bg-white px-3 py-2.5 text-xs text-charcoal-muted border border-charcoal/[0.06] truncate"
          >
            בנוגע ל: <span className="text-charcoal font-medium">{jesta.title}</span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {threadMessages.map((m) => {
          const mine = m.senderId === currentUserId;
          const sender = getUser(m.senderId);
          return (
            <div
              key={m.id}
              className={cn("flex gap-2", mine ? "flex-row-reverse" : "flex-row")}
            >
              {!mine && (
                <span className="mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                  {sender?.name?.[0] ?? "?"}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-3xl px-3.5 py-2.5 text-sm leading-relaxed",
                  mine
                    ? "bg-coral text-white rounded-bl-lg shadow-soft"
                    : "bg-white text-charcoal border border-charcoal/[0.06] rounded-br-lg"
                )}
              >
                {!mine && (
                  <p className="mb-0.5 text-xs font-semibold text-coral">
                    {sender?.name}
                  </p>
                )}
                <p>{m.text}</p>
                <p
                  className={cn(
                    "mt-1 flex items-center justify-start gap-1 text-[10px]",
                    mine ? "text-white/80" : "text-charcoal-light"
                  )}
                >
                  {formatTime(m.createdAt)}
                  {mine && <CheckCheck className="h-3 w-3" />}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 px-3 pb-2">
        <button
          type="button"
          onClick={() =>
            sendMessage(thread.id, "📍 שיתפתי מיקום כללי באזור שלי")
          }
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full pill-inactive py-2.5 text-xs"
        >
          <MapPin className="h-3.5 w-3.5 text-red-500" />
          שתף מיקום כללי
        </button>
        <button
          type="button"
          onClick={() =>
            sendMessage(thread.id, "✅ סיימנו את הג׳סטה — תודה!")
          }
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-coral/25 bg-coral-soft py-2.5 text-xs font-medium text-coral"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          סיימנו את הג׳סטה
        </button>
      </div>

      {/* Input */}
      <div className="border-t border-charcoal/5 bg-white px-3 py-3 pb-safe">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-charcoal-muted" aria-label="צירוף">
            <Paperclip className="h-5 w-5" />
          </button>
          <button type="button" className="p-2 text-charcoal-muted" aria-label="אימוג׳י">
            <Smile className="h-5 w-5" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="כתוב הודעה..."
            className="flex-1 rounded-2xl border border-charcoal/[0.07] bg-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/25"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!text.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral text-white shadow-soft disabled:opacity-40"
            aria-label="שלח"
          >
            <Send className="h-5 w-5 -scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
