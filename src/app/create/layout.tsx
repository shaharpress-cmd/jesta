import type { Metadata } from "next";

const title = "פרסום ג׳סטה";
const description =
  "פרסמו בקשת עזרה או הצעה לשכנים באזור שלכם. ג׳סטה מתווכת בלבד ואינה מבטיחה תוצאה — בלי תשלומים.";

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

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
