"use client";
import { useEffect, useState } from "react";
import { useMealistStore } from "@/store/mealist.store";

interface Props {
  recipeId: string;
  className?: string;
}

const PinButton = ({ recipeId, className = "" }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  return <PinButtonInner recipeId={recipeId} className={className} />;
};

const PinButtonInner = ({ recipeId, className }: { recipeId: string; className: string }) => {
  const isPinned = useMealistStore((s) => s.pinnedIds.includes(recipeId));
  const togglePin = useMealistStore((s) => s.togglePin);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); togglePin(recipeId); }}
      className={`pin-btn${isPinned ? " pin-btn--active" : ""} ${className}`.trim()}
      aria-label={isPinned ? "Remove from saved" : "Save recipe"}
      aria-pressed={isPinned}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default PinButton;
