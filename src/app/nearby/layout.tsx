import type { Metadata } from "next";

const title = "לידך עכשיו";
const description =
  "מפה ורדיוס: מצאו שכנים וג׳סטות פתוחות באזור שלכם. ג׳סטה מתווכת בלבד — האחריות על המשתמשים.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "he_IL",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function NearbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
