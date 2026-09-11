"use client";

import { useMemo, useState } from "react";
import { Users, HandHelping, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { RadiusFilter } from "@/components/RadiusFilter";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { UserCard } from "@/components/UserCard";
import { JestaCard } from "@/components/JestaCard";
import { useStore } from "@/lib/store";
import { RADIUS_OPTIONS } from "@/lib/categories";
import { cn } from "@/lib/utils";

type Tab = "all" | "helpers" | "seekers";

export default function NearbyPage() {
  const {
    users,
    filteredJestas,
    getUser,
    radius,
    setRadius,
    onlineOnly,
    setOnlineOnly,
    currentUserId,
  } = useStore();
  const [tab, setTab] = useState<Tab>("all");

  const maxM = RADIUS_OPTIONS.find((r) => r.id === radius)?.meters ?? null;

  const nearbyUsers = useMemo(() => {
    return users
      .filter((u) => u.id !== currentUserId)
      .filter((u) => (maxM === null ? true : (u.distanceM ?? 0) <= maxM))
      .filter((u) => (onlineOnly ? u.online : true))
      .sort((a, b) => (a.distanceM ?? 0) - (b.distanceM ?? 0));
  }, [users, maxM, onlineOnly, currentUserId]);

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "all", label: "כולם", icon: Users },
    { id: "helpers", label: "מוכנים לעזור", icon: HandHelping },
    { id: "seekers", label: "מבקשים עזרה", icon: Heart },
  ];

  return (
    <div>
      <Header subtitle="לידך עכשיו" location='תל אביב · 2 ק״מ' showMenu />

      <div className="page-pad space-y-4">
        <RadiusFilter value={radius} onChange={setRadius} />

        <div className="relative">
          <MapPlaceholder className="h-48 w-full" pins={5} />
          <label className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium border border-charcoal/[0.06] cursor-pointer">
            <span
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                onlineOnly ? "bg-sage" : "bg-charcoal/15"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                  onlineOnly ? "right-0.5" : "right-[18px]"
                )}
              />
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
            />
            רק מי שאונליין
          </label>
        </div>

        <div className="flex gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs transition-colors duration-200 min-h-11",
                tab === id ? "pill-active" : "pill-inactive"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="feed-grid">
          {(tab === "all" || tab === "helpers") &&
            nearbyUsers.map((u) => <UserCard key={u.id} user={u} />)}

          {(tab === "all" || tab === "seekers") &&
            filteredJestas.map((j) => (
              <JestaCard key={j.id} jesta={j} author={getUser(j.authorId)} />
            ))}

          {tab === "helpers" && nearbyUsers.length === 0 && (
            <Empty />
          )}
          {tab === "seekers" && filteredJestas.length === 0 && (
            <Empty />
          )}
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="card-soft p-8 text-center md:col-span-2 xl:col-span-3">
      <p className="text-3xl mb-2">📍</p>
      <p className="font-medium">אין תוצאות בטווח</p>
      <p className="text-sm text-charcoal-muted mt-1">נסו להרחיב את הרדיוס</p>
    </div>
  );
}
