"use client";
import { useEffect } from "react";
import { useMealistStore } from "@/store/mealist.store";

const StoreHydration = () => {
  useEffect(() => {
    useMealistStore.persist.rehydrate();
  }, []);
  return null;
};

export default StoreHydration;
