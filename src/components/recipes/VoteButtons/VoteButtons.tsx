"use client";
import { useEffect, useState } from "react";
import { useMealistStore } from "@/store/mealist.store";
import { callVoteRecipe } from "@/api/firebase.config";

interface Props {
  recipeId: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
}

const VoteButtons = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  return <VoteButtonsInner {...props} />;
};

const VoteButtonsInner = ({ recipeId, initialUpvotes = 0, initialDownvotes = 0 }: Props) => {
  const voteFromStore = useMealistStore((s) => s.voteMap[recipeId] ?? null);
  const setVote = useMealistStore((s) => s.setVote);

  const [counts, setCounts] = useState({ up: initialUpvotes, down: initialDownvotes });
  const [loading, setLoading] = useState(false);

  const current = voteFromStore;

  async function handleVote(action: "upvote" | "downvote") {
    if (loading) return;
    const next = current === action ? null : action;
    const previous = current;

    setCounts((c) => {
      const up = c.up + (previous === "upvote" ? -1 : 0) + (next === "upvote" ? 1 : 0);
      const down = c.down + (previous === "downvote" ? -1 : 0) + (next === "downvote" ? 1 : 0);
      return { up: Math.max(0, up), down: Math.max(0, down) };
    });
    setVote(recipeId, next);

    setLoading(true);
    try {
      await callVoteRecipe(recipeId, next, previous);
    } catch {
      setCounts({ up: initialUpvotes, down: initialDownvotes });
      setVote(recipeId, previous);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vote-btns">
      <button
        type="button"
        onClick={() => handleVote("upvote")}
        disabled={loading}
        className={`vote-btns__btn${current === "upvote" ? " vote-btns__btn--active" : ""}`}
        aria-label="Upvote"
        aria-pressed={current === "upvote"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={current === "upvote" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        <span>{counts.up > 0 ? counts.up : ""}</span>
      </button>

      <button
        type="button"
        onClick={() => handleVote("downvote")}
        disabled={loading}
        className={`vote-btns__btn${current === "downvote" ? " vote-btns__btn--active vote-btns__btn--down" : ""}`}
        aria-label="Downvote"
        aria-pressed={current === "downvote"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={current === "downvote" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
        <span>{counts.down > 0 ? counts.down : ""}</span>
      </button>
    </div>
  );
};

export default VoteButtons;
