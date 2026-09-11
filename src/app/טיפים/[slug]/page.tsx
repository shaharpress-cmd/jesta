import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { TipsDisclaimer } from "@/components/TipsDisclaimer";
import { CATEGORY_MAP } from "@/lib/categories";
import {
  TIP_BY_SLUG,
  TIP_PAGES,
  createHrefForCategory,
  tipHref,
} from "@/lib/tips";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return TIP_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = TIP_BY_SLUG[decodeURIComponent(params.slug)];
  if (!page) return { title: "טיפים" };
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://jesta-pink.vercel.app";
  const url = `${site}/טיפים/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      locale: "he_IL",
    },
    twitter: {
      card: "summary",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

function faqJsonLd(page: (typeof TIP_PAGES)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export default function TipPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const page = TIP_BY_SLUG[slug];
  if (!page) notFound();

  const cat = CATEGORY_MAP[page.id];
  const others = TIP_PAGES.filter((p) => p.slug !== page.slug).slice(0, 4);

  return (
    <div>
      <Header
        title={cat.shortLabel}
        showBack
        backHref="/טיפים"
        showBell={false}
        showMenu={false}
      />

      <article className="page-pad space-y-6 pb-10 max-w-3xl mx-auto">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-charcoal-muted">
            <span aria-hidden className="text-lg">
              {cat.emoji}
            </span>
            <span>{cat.label}</span>
          </div>
          <h1 className="text-2xl font-black text-charcoal leading-snug">
            {page.h1}
          </h1>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {page.intro}
          </p>
        </header>

        <TipsDisclaimer />

        <section className="space-y-3" aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="text-lg font-bold text-charcoal">
            טיפים מעשיים
          </h2>
          <ol className="space-y-3">
            {page.tips.map((tip, i) => (
              <li key={tip} className="card-soft flex gap-3 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral-soft text-sm font-bold text-coral">
                  {i + 1}
                </span>
                <p className="text-sm text-charcoal leading-relaxed pt-0.5">
                  {tip}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="rounded-3xl bg-coral-soft/60 border border-coral/15 p-5 space-y-3"
          aria-labelledby="when-heading"
        >
          <h2 id="when-heading" className="text-lg font-bold text-charcoal">
            מתי לבקש ג׳סטה
          </h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {page.whenToAsk}
          </p>
          <Link
            href={createHrefForCategory(page.id)}
            className="cta-coral"
          >
            בקשו ג׳סטה · {cat.shortLabel}
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </section>

        <section className="space-y-3" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-bold text-charcoal">
            שאלות נפוצות
          </h2>
          <dl className="space-y-3">
            {page.faq.map((item) => (
              <div key={item.q} className="card-soft p-4 space-y-1.5">
                <dt className="font-semibold text-charcoal text-sm">{item.q}</dt>
                <dd className="text-sm text-charcoal-muted leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(page)),
          }}
        />

        <TipsDisclaimer />

        <nav className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-charcoal">עוד מדריכים</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={tipHref(p.slug)}
                  className="pill-inactive px-3 py-1.5 text-xs inline-flex"
                >
                  {CATEGORY_MAP[p.id].emoji} {CATEGORY_MAP[p.id].shortLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/טיפים"
                className="pill-inactive px-3 py-1.5 text-xs inline-flex"
              >
                כל הטיפים
              </Link>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 justify-center text-sm pt-2">
            <Link href="/" className="font-medium text-charcoal-muted hover:text-coral">
              בית
            </Link>
            <span className="text-charcoal-light">·</span>
            <Link
              href="/nearby"
              className="font-medium text-charcoal-muted hover:text-coral"
            >
              לידך
            </Link>
          </div>
        </nav>
      </article>
    </div>
  );
}
