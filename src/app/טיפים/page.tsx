import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { TipsDisclaimer } from "@/components/TipsDisclaimer";
import { CATEGORY_MAP } from "@/lib/categories";
import { TIP_PAGES, TIPS_HUB, tipHref } from "@/lib/tips";

const TIPS_SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://jesta-pink.vercel.app";
const TIPS_HUB_URL = `${TIPS_SITE}/טיפים`;

export const metadata: Metadata = {
  title: TIPS_HUB.metaTitle,
  description: TIPS_HUB.metaDescription,
  alternates: { canonical: TIPS_HUB_URL },
  openGraph: {
    title: TIPS_HUB.metaTitle,
    description: TIPS_HUB.metaDescription,
    url: TIPS_HUB_URL,
    locale: "he_IL",
  },
  twitter: {
    card: "summary",
    title: TIPS_HUB.metaTitle,
    description: TIPS_HUB.metaDescription,
  },
};

export default function TipsHubPage() {
  return (
    <div>
      <Header title="טיפים" showBack backHref="/" showBell={false} showMenu={false} />

      <div className="page-pad space-y-5 pb-8 max-w-3xl mx-auto">
        <section className="space-y-2">
          <h1 className="text-2xl font-black text-charcoal leading-snug">
            {TIPS_HUB.h1}
          </h1>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {TIPS_HUB.intro}
          </p>
        </section>

        <TipsDisclaimer />

        <ul className="space-y-3">
          {TIP_PAGES.map((p) => {
            const cat = CATEGORY_MAP[p.id];
            return (
              <li key={p.slug}>
                <Link
                  href={tipHref(p.slug)}
                  className="card-soft flex items-start gap-3 p-4 transition active:scale-[0.99] hover:border-coral/20"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
                    style={{ backgroundColor: `${cat.color}22` }}
                    aria-hidden
                  >
                    {cat.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-charcoal leading-snug">
                      {p.h1}
                    </span>
                    <span className="mt-1 block text-xs text-charcoal-muted line-clamp-2">
                      {p.intro}
                    </span>
                    <span className="mt-2 inline-block text-xs font-semibold text-coral">
                      {cat.label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <nav className="flex flex-wrap gap-3 justify-center text-sm pt-2">
          <Link href="/" className="font-medium text-charcoal-muted hover:text-coral">
            בית
          </Link>
          <span className="text-charcoal-light">·</span>
          <Link href="/nearby" className="font-medium text-charcoal-muted hover:text-coral">
            לידך
          </Link>
          <span className="text-charcoal-light">·</span>
          <Link href="/create" className="font-medium text-coral hover:underline">
            בקשת ג׳סטה
          </Link>
        </nav>
      </div>
    </div>
  );
}
