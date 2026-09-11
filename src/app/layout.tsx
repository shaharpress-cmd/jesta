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

export const metadata: Metadata = {
  title: "ג׳סטה | Jesta — עזרה שכנית",
  description:
    "פלטפורמת עזרה הדדית בין שכנים. ג׳סטה מתווכת בלבד — האחריות על המשתמשים.",
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
