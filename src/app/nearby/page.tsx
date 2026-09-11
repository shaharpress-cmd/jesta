"use client";

import { useMemo, useState } from "react";
import { Users, HandHelping, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { RadiusFilter } from "@/components/RadiusFilter";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { UserCard } from "@/components/UserCard";
import { JestaCard } from "@/components/JestaCard";
import { EmptyState, PageFrame } from "@/components/EmptyState";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { SessionModeChip } from "@/components/SessionModeChip";
import { useStore } from "@/lib/store";
import { RADIUS_OPTIONS } from "@/lib/categories";
import { exampleLocationChip } from "@/lib/location";
import { cn } from "@/lib/utils";

type Tab = "all" | "helpers" | "seekers";

function isHelperUser(u: { helpCategories?: string[]; online?: boolean }) {
  return Array.isArray(u.helpCategories) && u.helpCategories.length > 0;
}

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
    storeReady,
    isLoggedIn,
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

  const helperUsers = useMemo(
    () => nearbyUsers.filter(isHelperUser),
    [nearbyUsers]
  );

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "all", label: "כולם", icon: Users },
    { id: "helpers", label: "מוכנים לעזור", icon: HandHelping },
    { id: "seekers", label: "מבקשים עזרה", icon: Heart },
  ];

  const peopleForTab = tab === "helpers" ? helperUsers : nearbyUsers;
  const emptyHelpers = tab === "helpers" && helperUsers.length === 0;
  const emptySeekers = tab === "seekers" && filteredJestas.length === 0;
  const emptyAll =
    tab === "all" && nearbyUsers.length === 0 && filteredJestas.length === 0;

  const locationLabel = exampleLocationChip({ guest: !isLoggedIn });

  return (
    <PageFrame>
      <Header subtitle="לידך עכשיו" location={locationLabel} showMenu />

      <div className="page-pad space-y-4">
        <div className="flex justify-center sm:justify-start">
          <SessionModeChip />
        </div>

        <RadiusFilter value={radius} onChange={setRadius} />

        <div className="relative">
          <MapPlaceholder
            className="h-48 w-full"
            pins={5}
            label={locationLabel}
          />
          <label className="absolute top-3 end-3 flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-medium border border-charcoal/[0.06] cursor-pointer touch-manipulation shadow-sm">
            <span
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                onlineOnly ? "bg-sage" : "bg-charcoal/15"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                  onlineOnly ? "end-0.5" : "end-[18px]"
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
                tab === id ? "chip-active" : "chip-inactive",
                "flex-1"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {!storeReady ? (
          <FeedSkeleton cards={4} />
        ) : (
          <div className={emptyHelpers || emptySeekers || emptyAll ? "feed-grid feed-sparse" : "feed-grid"}>
            {(tab === "all" || tab === "helpers") &&
              peopleForTab.map((u) => <UserCard key={u.id} user={u} />)}

            {(tab === "all" || tab === "seekers") &&
              filteredJestas.map((j) => (
                <JestaCard key={j.id} jesta={j} author={getUser(j.authorId)} />
              ))}

            {(emptyHelpers || emptySeekers || emptyAll) && (
              <EmptyState
                emoji="📍"
                title={
                  emptyHelpers
                    ? "אין מוכנים לעזור בטווח"
                    : "אין תוצאות בטווח"
                }
                body={
                  emptyHelpers
                    ? "נסו «כולם» או לכבות «רק מי שאונליין» — או הרחיבו רדיוס."
                    : "נסו להרחיב את הרדיוס — או פרסמו ג׳סטה חדשה."
                }
                primaryHref="/create"
                primaryLabel="פרסמו ג׳סטה"
                secondaryHref="/"
                secondaryLabel="לבית"
              />
            )}
          </div>
        )}
      </div>
    </PageFrame>
  );
}
