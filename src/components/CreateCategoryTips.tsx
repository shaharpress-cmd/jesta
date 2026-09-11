"use client";

import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { TIP_BY_ID, tipHref } from "@/lib/tips";
import { SAFETY } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

export function CreateCategoryTips({ category }: { category: CategoryId }) {
  const page = TIP_BY_ID[category];
  if (!page) return null;
  const preview = page.tips.slice(0, 3);

  return (
    <div className="card-soft p-4 space-y-3 border-coral/10">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-coral" />
        <h2 className="text-sm font-bold text-charcoal">טיפים קצרים · {page.h1}</h2>
      </div>
      <ul className="space-y-2">
        {preview.map((t) => (
          <li key={t} className="text-sm text-charcoal-muted leading-relaxed flex gap-2">
            <span className="text-coral font-bold shrink-0">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-charcoal-light leading-relaxed">
        {SAFETY.tipsDisclaimer} {SAFETY.intermediary}.
      </p>
      <Link
        href={tipHref(page.slug)}
        className="inline-flex text-sm font-semibold text-coral hover:underline"
      >
        למדריך המלא ←
      </Link>
    </div>
  );
}
