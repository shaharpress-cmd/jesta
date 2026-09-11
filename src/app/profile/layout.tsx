import type { Metadata } from "next";

const title = "פרופיל";
const description =
  "פרופיל משתמש בג׳סטה — תגים, דירוגים וסטטיסטיקות. עמוד אישי; לא לאינדוקס מלא.";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: true,
  },
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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
