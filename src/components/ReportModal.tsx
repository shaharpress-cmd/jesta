"use client";

import { useState } from "react";
import { X, Flag } from "lucide-react";

const REASONS = [
  "תוכן לא הולם",
  "חשד להונאה",
  "בקשה מקצועית / בתשלום",
  "מיקום מסוכן",
  "אחר",
];

export function ReportModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState(REASONS[0]);
  const [done, setDone] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl animate-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
            <Flag className="h-5 w-5 text-coral" />
            דיווח
          </h2>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              onClose();
            }}
            className="rounded-full p-1.5 hover:bg-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <p className="text-charcoal font-medium">תודה, הדיווח התקבל</p>
            <p className="text-sm text-charcoal-muted mt-2">
              נבדוק ונפעל בהתאם. ג׳סטה מתווכת בלבד.
            </p>
            <button
              type="button"
              onClick={() => {
                setDone(false);
                onClose();
              }}
              className="mt-4 rounded-full bg-coral px-6 py-2.5 text-white font-medium"
            >
              סגור
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-charcoal-muted mb-3">
              בחרו סיבה. ניתן גם לחסום משתמש מהפרופיל.
            </p>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 rounded-xl border border-charcoal/10 px-3 py-2.5 cursor-pointer hover:bg-cream"
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-coral"
                  />
                  <span className="text-sm text-charcoal">{r}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                onSubmit(reason);
                setDone(true);
              }}
              className="mt-5 w-full rounded-2xl bg-coral py-3.5 font-bold text-white"
            >
              שלח דיווח
            </button>
          </>
        )}
      </div>
    </div>
  );
}
