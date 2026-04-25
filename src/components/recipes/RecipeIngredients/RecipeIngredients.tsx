"use client";
import { useState } from "react";
import type { RecipeIngredient } from "@/api/firebase.config";
import { formatAmount } from "@/lib/recipe-units";

interface Props {
  ingredients: RecipeIngredient[];
  baseServings: number;
}

const RecipeIngredients = ({ ingredients, baseServings }: Props) => {
  const [servings, setServings] = useState(baseServings);
  const [unit, setUnit] = useState<"us" | "metric">("us");
  const scale = servings / baseServings;

  return (
    <section className="recipe-detail__ingredients">
      <h2 className="recipe-detail__section-title">Ingredients</h2>

      <div className="recipe-detail__controls">
        <div className="recipe-detail__servings">
          <button
            type="button"
            className="recipe-detail__qty-btn"
            onClick={() => setServings(Math.max(1, servings - 1))}
            aria-label="Fewer servings"
          >−</button>
          <span className="recipe-detail__qty-label">
            <strong>{servings}</strong> {servings === 1 ? "serving" : "servings"}
          </span>
          <button
            type="button"
            className="recipe-detail__qty-btn"
            onClick={() => setServings(Math.min(50, servings + 1))}
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
        {ingredients.map((ing, i) => (
          <li key={i} className="recipe-detail__ingredient">
            <span className="recipe-detail__amount">
              {ing.amount ? formatAmount(ing.amount, scale, unit === "metric") : "-"}
            </span>
            <span className="recipe-detail__item">{ing.name ?? ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecipeIngredients;
