"use client";
import { useState } from "react";
import type { RecipeIngredient } from "@/api/firebase.config";
import { formatAmount } from "@/lib/recipe-units";
import { useMealistStore } from "@/store/mealist.store";

interface Props {
  ingredients: RecipeIngredient[];
  baseServings: number;
  servings: number;
  onServingsChange: (n: number) => void;
}

const RecipeIngredients = ({ ingredients, baseServings, servings, onServingsChange }: Props) => {
  const unit = useMealistStore((s) => s.unit);
  const setUnit = useMealistStore((s) => s.setUnit);
  const scale = servings / baseServings;
  const [copied, setCopied] = useState(false);

  const copyIngredients = () => {
    console.log("[copy] ingredients prop:", ingredients);
    console.log("[copy] scale:", scale, "servings:", servings, "base:", baseServings);
    const lines = ingredients.map((ing) => {
      const sf = ing.scalingFactor ?? 1;
      const effectiveScale = 1 + (scale - 1) * sf;
      const amount = ing.amount ? formatAmount(ing.amount, effectiveScale, unit === "metric") : "";
      const label = ing.shoppingName ?? ing.normalized ?? ing.name ?? "";
      return [amount, label].filter(Boolean).join(" ");
    });
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section className="recipe-detail__ingredients">
      <h2 className="recipe-detail__section-title">Ingredients</h2>

      <div className="recipe-detail__controls">
        <div className="recipe-detail__servings">
          <button
            type="button"
            className="recipe-detail__qty-btn"
            onClick={() => onServingsChange(Math.max(1, servings - 1))}
            aria-label="Fewer servings"
          >−</button>
          <span className="recipe-detail__qty-label">
            <strong>{servings}</strong> {servings === 1 ? "serving" : "servings"}
          </span>
          <button
            type="button"
            className="recipe-detail__qty-btn"
            onClick={() => onServingsChange(Math.min(50, servings + 1))}
            aria-label="More servings"
          >+</button>
        </div>

        <div className="recipe-detail__unit-toggle">
          <button
            type="button"
            onClick={() => setUnit("us")}
            className={`recipe-detail__unit-btn${unit === "us" ? " recipe-detail__unit-btn--active" : ""}`}
          >US</button>
          <button
            type="button"
            onClick={() => setUnit("metric")}
            className={`recipe-detail__unit-btn${unit === "metric" ? " recipe-detail__unit-btn--active" : ""}`}
          >Metric</button>

        </div>
      </div>

      <ul className="recipe-detail__ingredient-list">
        {ingredients.map((ing, i) => {
          const sf = ing.scalingFactor ?? 1;
          const effectiveScale = 1 + (scale - 1) * sf;
          return (
            <li key={i} className="recipe-detail__ingredient">
              <span className="recipe-detail__amount">
                {ing.amount ? formatAmount(ing.amount, effectiveScale, unit === "metric") : "-"}
              </span>
              <span className="recipe-detail__item">{ing.name ?? ""}</span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={`recipe-detail__copy-btn${copied ? " recipe-detail__copy-btn--copied" : ""}`}
        onClick={copyIngredients}
      >
        {copied ? "Copied!" : "Copy list"}
      </button>
    </section>
  );
};

export default RecipeIngredients;
