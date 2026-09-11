import type { Metadata } from "next";
import Link from "next/link";
import {
  HandHelping,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { SafetyBanner } from "@/components/SafetyBanner";
import { Wordmark } from "@/components/Wordmark";
import { SAFETY } from "@/lib/categories";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://jesta-pink.vercel.app";
const ABOUT_URL = `${SITE}/about`;

export const metadata: Metadata = {
  title: "מה זה ג׳סטה? עזרה בין אנשים באזור שלך",
  description:
    "ג׳סטה מחברת בין מי שצריך עזרה למי שרוצה לתת — לפי מיקום. מתווכת בלבד, עם טיפי בטיחות בסיסיים.",
  alternates: { canonical: ABOUT_URL },
  openGraph: {
    title: "מה זה ג׳סטה? עזרה בין אנשים באזור שלך",
    description:
      "עזרה בין אנשים לפי מיקום — בקשו או הציעו ג׳סטה באזור שלכם. ג׳סטה מתווכת בלבד ואינה מבצעת את העזרה.",
    url: ABOUT_URL,
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "מה זה ג׳סטה?",
    description: "עזרה בין אנשים לפי מיקום. מתווכת בלבד.",
  },
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    icon: MapPin,
    title: "רואים מה קורה לידכם",
    body: "הפיד מציג בקשות עזרה לפי רדיוס וקטגוריה — דלק, הובלה קלה, קניות ועוד.",
  },
  {
    icon: HandHelping,
    title: "מבקשים או עוזרים",
    body: "מפרסמים ג׳סטה קצרה, או מציעים עזרה למי שלידכם. התיאום ממשיך בצ׳אט.",
  },
  {
    icon: MessageCircle,
    title: "מתאמים בשקט",
    body: "שומרים על כבוד, ומעדיפים מקום ציבורי במפגש ראשון.",
  },
];

export default function AboutPage() {
  return (
    <div className="anim-page">
      <Header title="מה זה ג׳סטה?" showBack backHref="/" showBell={false} showMenu />

      <article className="page-pad space-y-6 pb-10 max-w-3xl mx-auto">
        <header className="space-y-3 anim-enter">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold text-coral">
            <Sparkles className="h-3.5 w-3.5" />
            עזרה בין אנשים · לפי מיקום
          </p>
          <Wordmark size="lg" bilingual bilingualPlacement="beside" />
          <h1 className="text-fluid-xl font-black text-charcoal leading-snug">
            מי שצריך ג׳סטה, ומי שרוצה לתת
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
            לפעמים צריך יד קצרה: דלק בדרך, הרמת מקרר, קניות באזור. ג׳סטה מחברת
            בין אנשים לפי מיקום — וניתן להתקין כאפליקציה (PWA).
          </p>
        </header>

        <section className="card-soft p-5 space-y-2 anim-enter" style={{ animationDelay: "60ms" }}>
          <h2 className="text-lg font-bold text-charcoal">למה?</h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            כי אנשים יכולים לעזור זה לזה במהירות, בלי סיבוך. המטרה היא חיבור
            שקט — לא שוק שירותים ולא תחליף לחירום.
          </p>
        </section>

        <section id="how" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-bold text-charcoal">איך זה עובד</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="card-soft p-4 space-y-2.5 h-full anim-enter"
                style={{ animationDelay: `${100 + i * 60}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-coral-soft text-coral font-bold text-sm">
                    {i + 1}
                  </span>
                  <Icon className="h-4 w-4 text-coral" aria-hidden />
                </div>
                <h3 className="font-bold text-charcoal text-[15px]">{title}</h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="safety"
          className="rounded-3xl safety-amber p-5 space-y-3 scroll-mt-24"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-charcoal">
            <Shield className="h-5 w-5 text-amber-700/70" />
            בטיחות בסיסית
          </h2>
          <ul className="space-y-2 text-sm text-charcoal/90 leading-relaxed list-disc pe-5">
            <li>{SAFETY.publicPlace}</li>
            <li>{SAFETY.noExactAddress}</li>
            <li>{SAFETY.tipsEmergency}</li>
            <li>דיווח זמין מכל כרטיס ג׳סטה — השתמשו בו אם משהו מרגיש לא בסדר.</li>
          </ul>
          <Link
            href="/טיפים"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-coral hover:underline"
          >
            למדריכי טיפים ובטיחות
          </Link>
        </section>

        <section className="card-soft p-5 space-y-2">
          <h2 className="text-lg font-bold text-charcoal">מתווכת בלבד</h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {SAFETY.intermediary}. ג׳סטה אינה מבצעת את העזרה ואינה אחראית לפגישות.
            בשלב הזה אין תשלומים בתוך האפליקציה — כל סיכום (אם בכלל) הוא בין
            המשתמשים בלבד.
          </p>
        </section>

        <section className="space-y-3">
          <Link href="/login" className="cta-coral">
            המשך עם Google
          </Link>
          <Link
            href="/create"
            className="btn-outline-coral"
          >
            פרסמו ג׳סטה
          </Link>
          <div className="flex flex-wrap justify-center gap-3 text-sm pt-1">
            <Link href="/טיפים" className="font-medium text-charcoal-muted hover:text-coral">
              טיפים
            </Link>
            <span className="text-charcoal-light">·</span>
            <Link href="/" className="font-medium text-charcoal-muted hover:text-coral">
              חזרה לבית
            </Link>
          </div>
        </section>

        <SafetyBanner variant="footer" className="justify-center" />
      </article>
    </div>
  );
}
