"use client";
import Link from "next/link";
import { useMealistStore } from "@/store/mealist.store";

const SavedLink = () => {
  const count = useMealistStore((s) => s.pinnedIds.length);

  return (
    <Link href="/saved" className="navigation__link navigation__link--saved">
      Saved
      {count > 0 && <span className="navigation__badge">{count}</span>}
    </Link>
  );
};

export default SavedLink;
