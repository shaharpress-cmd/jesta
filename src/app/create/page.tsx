"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Zap, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryPills } from "@/components/CategoryPills";
import { SafetyBanner } from "@/components/SafetyBanner";
import { useStore } from "@/lib/store";
import type { CategoryId, Urgency } from "@/lib/types";
import { cn } from "@/lib/utils";

const URGENCY: { id: Urgency; label: string; icon: typeof Zap }[] = [
  { id: "now", label: "עכשיו", icon: Zap },
  { id: "today", label: "היום", icon: Calendar },
  { id: "flexible", label: "גמיש", icon: Clock },
];

export default function CreatePage() {
  const router = useRouter();
  const { createJesta } = useStore();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("fuel");
  const [location, setLocation] = useState("תל אביב, אזור איילון");
  const [urgency, setUrgency] = useState<Urgency>("now");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    description.trim().length >= 8 && location.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const title =
      description.trim().length > 40
        ? description.trim().slice(0, 40) + "…"
        : description.trim();
    const j = createJesta({
      title,
      description: description.trim(),
      category,
      locationLabel: location.trim(),
      urgency,
    });
    router.push(`/jesta/${j.id}`);
  };

  return (
    <div className="min-h-dvh">
      <Header title="בקשת ג׳סטה" showBack backHref="/" showBell={false} showMenu={false} />

      <div className="px-4 space-y-5 pb-8">
        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            מה צריך?
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="נגמר לי הדלק ליד..."
              className="w-full rounded-2xl border border-charcoal/10 bg-white p-4 pe-4 ps-4 text-sm shadow-card placeholder:text-charcoal-light focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none"
            />
            <Pencil className="absolute bottom-3 end-3 h-4 w-4 text-charcoal-light" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            קטגוריה:
          </label>
          <CategoryPills
            selected={category}
            onSelect={(id) => { if (id !== "all") setCategory(id); }}
            showAll={false}
            compact
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            איפה:
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-charcoal/10 bg-white px-4 py-3.5 shadow-card">
            <MapPin className="h-5 w-5 text-charcoal shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
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
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-medium transition-all",
                  urgency === id
                    ? "bg-coral text-white shadow-soft"
                    : "bg-white border border-charcoal/10 text-charcoal"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <SafetyBanner variant="tip" />

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={onSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-coral py-4 text-base font-bold text-white shadow-soft disabled:opacity-50"
        >
          פרסם ג׳סטה
          <ArrowLeft className="h-5 w-5" />
        </button>

        <p className="text-center text-xs text-charcoal-muted px-4">
          בפרסום אתם מאשרים שזו עזרה לא-מקצועית ללא תשלום. ג׳סטה מתווכת בלבד.
        </p>
      </div>
    </div>
  );
}
