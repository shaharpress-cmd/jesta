import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const defaultTitle = "Jesta — עזרה בין אנשים באזור שלך";
const defaultDescription =
  "ג׳סטה מחברת בין מי שצריך עזרה למי שרוצה לתת — לפי מיקום באזור שלך. דלק, הובלה קלה, קניות ועוד. הפלטפורמה מתווכת בלבד ואינה מבצעת את העזרה; האחריות על המשתמשים.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Jesta",
  },
  description: defaultDescription,
  applicationName: "Jesta",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jesta",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Jesta",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#E07A5F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-heebo bg-cream-deep text-charcoal antialiased text-[15px] sm:text-base">
        <StoreProvider>
          <div className="app-shell relative mx-auto min-h-dvh w-full bg-cream sm:shadow-card">
            <main className="pb-[calc(7.25rem+env(safe-area-inset-bottom))] lg:pb-36">{children}</main>
            <BottomNav />
          </div>
          <ServiceWorkerRegister />
        </StoreProvider>
      </body>
    </html>
  );
}
