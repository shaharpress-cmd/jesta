"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  JestiBuddy,
  type JestiVariant,
  type JestiCostume,
} from "@/components/JestiBuddy";
import { CATEGORIES } from "@/lib/categories";

const ALL: JestiVariant[] = ["idle", "help", "cheer", "seek", "wait", "wave"];
const COSTUMES: JestiCostume[] = [
  "brand",
  "fuel",
  "moving",
  "home",
  "errands",
  "garden",
  "pets",
  "digital",
  "neighborhood",
  "other",
];

function PreviewInner() {
  const sp = useSearchParams();
  const pose = sp.get("pose") as JestiVariant | null;
  const costume = (sp.get("costume") as JestiCostume | null) || "brand";
  const solo = pose && ALL.includes(pose);
  const validCostume = COSTUMES.includes(costume) ? costume : "brand";
  const isCategory = validCostume !== "brand";

  if (solo) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center p-10"
        style={{ background: "#F7F1E8" }}
        id={`pose-${pose}`}
        data-costume={validCostume}
      >
        <JestiBuddy
          role={isCategory ? "category" : "brand"}
          category={validCostume}
          variant={pose}
          size="lg"
          hold
          label={pose === "idle" && !isCategory ? "" : undefined}
        />
        <span className="mt-4 text-sm font-semibold text-charcoal-muted">
          {validCostume} · {pose}
        </span>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen p-8 sm:p-12" style={{ background: "#F7F1E8" }}>
      <h1 className="mb-2 text-center text-lg font-bold text-charcoal">
        ג׳סטי — character language
      </h1>
      <p className="mb-8 text-center text-sm text-charcoal-muted">
        Brand owl + category costumes (same geometric DNA)
      </p>

      <h2 className="mb-4 text-sm font-bold text-charcoal">Moods (brand)</h2>
      <div className="mx-auto mb-10 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-3">
        {ALL.map((v) => (
          <div
            key={v}
            id={`pose-${v}`}
            className="flex flex-col items-center justify-end gap-3 rounded-3xl border border-charcoal/10 bg-white/70 p-6"
            style={{ minHeight: 220 }}
          >
            <JestiBuddy
              role="brand"
              variant={v}
              size="lg"
              hold
              label={v === "idle" ? "" : undefined}
            />
            <span className="text-xs font-semibold text-charcoal-muted">{v}</span>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-sm font-bold text-charcoal">Category costumes</h2>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div
            key={c.id}
            id={`costume-${c.id}`}
            className="flex flex-col items-center justify-end gap-3 rounded-3xl border border-charcoal/10 bg-white/70 p-5"
            style={{ minHeight: 210 }}
          >
            <JestiBuddy
              role="category"
              category={c.id}
              variant="idle"
              size="lg"
              hold
              label=""
            />
            <span className="text-xs font-semibold text-charcoal-muted">
              {c.id} · {c.shortLabel}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function JestiPreviewPage() {
  return (
    <Suspense fallback={<div style={{ background: "#F7F1E8", minHeight: "100vh" }} />}>
      <PreviewInner />
    </Suspense>
  );
}
