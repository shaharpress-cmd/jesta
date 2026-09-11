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

const defaultTitle = "ג׳סטה — עזרה בין שכנים באזור שלך";
const defaultDescription =
  "ג׳סטה מחברת בין שכנים לעזרה מהירה באזור שלך — דלק, הובלה קלה, קניות ועוד. הפלטפורמה מתווכת בלבד ואינה מבצעת את העזרה; האחריות על המשתמשים. בלי תשלומים.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | ג׳סטה",
  },
  description: defaultDescription,
  applicationName: "ג׳סטה",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ג׳סטה",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "ג׳סטה",
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
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-heebo bg-cream-deep text-charcoal antialiased">
        <StoreProvider>
          <div className="mx-auto min-h-dvh max-w-md bg-cream relative sm:shadow-card">
            <main className="pb-28">{children}</main>
            <BottomNav />
          </div>
          <ServiceWorkerRegister />
        </StoreProvider>
      </body>
    </html>
  );
}
