"use client";
import { useState } from "react";
import { callGenerateRecipe } from "@/api/firebase.config";

export default function GenerateButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [label, setLabel] = useState("");

  async function handleClick() {
    setState("loading");
    try {
      const result = await callGenerateRecipe() as { data: { title?: string } };
      setLabel(result.data?.title ?? "done");
      setState("done");
    } catch (e) {
      setLabel(e instanceof Error ? e.message : "error");
      setState("error");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 999,
        padding: "0.65rem 1.1rem",
        borderRadius: "999px",
        border: "none",
        background: state === "done" ? "#2a7a3b" : state === "error" ? "#b91c1c" : "#C65D2F",
        color: "#fff",
        fontWeight: 600,
        fontSize: "0.85rem",
        cursor: state === "loading" ? "wait" : "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        transition: "background 0.2s",
      }}
    >
      {state === "idle" && "⚡ Generate recipe"}
      {state === "loading" && "Generating…"}
      {state === "done" && `✓ ${label}`}
      {state === "error" && `✗ ${label}`}
    </button>
  );
}
