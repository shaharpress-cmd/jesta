"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { SafetyBanner } from "@/components/SafetyBanner";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { users, setCurrentUserId, currentUserId } = useStore();
  const router = useRouter();

  return (
    <div>
      <Header title="התחברות דמו" showBack backHref="/profile" showBell={false} showMenu={false} />

      <div className="px-4 space-y-5">
        <div className="text-center pt-4">
          <p className="text-4xl font-black text-coral mb-2">ג׳סטה</p>
          <p className="text-sm text-charcoal-muted">
            בחרו משתמש לדמו. בהמשך — Supabase Auth / OAuth.
          </p>
        </div>

        <div className="space-y-2">
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                setCurrentUserId(u.id);
                router.push("/");
              }}
              className={`flex w-full items-center gap-3 card-soft p-3.5 text-right transition hover:border-coral/20 ${
                u.id === currentUserId ? "ring-2 ring-coral" : ""
              }`}
            >
              <Avatar src={u.avatar} name={u.name} size="md" online={u.online} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-charcoal">{u.name}</p>
                <p className="text-xs text-charcoal-muted">
                  ⭐ {u.rating.toFixed(1)} · {u.stats.given} ג׳סטות
                </p>
              </div>
              {u.id === currentUserId && (
                <span className="text-xs font-medium text-coral">פעיל</span>
              )}
            </button>
          ))}
        </div>

        <SafetyBanner variant="footer" className="justify-center" />
      </div>
    </div>
  );
}
