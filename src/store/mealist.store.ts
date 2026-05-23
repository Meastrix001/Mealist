import { create } from "zustand";
import { persist } from "zustand/middleware";

type Vote = "upvote" | "downvote";
export type UnitSystem = "us" | "metric";

interface MealistState {
  pinnedIds: string[];
  voteMap: Record<string, Vote>;
  unit: UnitSystem;
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  setVote: (id: string, vote: Vote | null) => void;
  getVote: (id: string) => Vote | null;
  setUnit: (unit: UnitSystem) => void;
}

export const useMealistStore = create<MealistState>()(
  persist(
    (set, get) => ({
      pinnedIds: [],
      voteMap: {},
      unit: "metric",
      togglePin: (id) =>
        set((s) => ({
          pinnedIds: s.pinnedIds.includes(id)
            ? s.pinnedIds.filter((p) => p !== id)
            : [...s.pinnedIds, id],
        })),
      isPinned: (id) => get().pinnedIds.includes(id),
      setVote: (id, vote) =>
        set((s) => {
          const next = { ...s.voteMap };
          if (vote === null) delete next[id];
          else next[id] = vote;
          return { voteMap: next };
        }),
      getVote: (id) => get().voteMap[id] ?? null,
      setUnit: (unit) => set({ unit }),
    }),
    { name: "mealist-store" }
  )
);
