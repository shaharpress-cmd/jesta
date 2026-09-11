"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { JestiBuddy, type JestiVariant } from "@/components/JestiBuddy";

const ALL: JestiVariant[] = ["idle", "help", "cheer", "seek", "wait", "wave"];

function PreviewInner() {
  const sp = useSearchParams();
  const pose = sp.get("pose") as JestiVariant | null;
  const solo = pose && ALL.includes(pose);

  if (solo) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center p-10"
        style={{ background: "#F7F1E8" }}
        id={`pose-${pose}`}
      >
        <JestiBuddy variant={pose} size="lg" hold label={pose === "idle" ? "" : undefined} />
        <span className="mt-4 text-sm font-semibold text-charcoal-muted">{pose}</span>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen p-8 sm:p-12" style={{ background: "#F7F1E8" }}>
      <h1 className="mb-8 text-center text-lg font-bold text-charcoal">
        ג׳סטי — Concept B preview
      </h1>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-3">
        {ALL.map((v) => (
          <div
            key={v}
            id={`pose-${v}`}
            className="flex flex-col items-center justify-end gap-3 rounded-3xl border border-charcoal/10 bg-white/70 p-6"
            style={{ minHeight: 220 }}
          >
            <JestiBuddy variant={v} size="lg" hold label={v === "idle" ? "" : undefined} />
            <span className="text-xs font-semibold text-charcoal-muted">{v}</span>
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
