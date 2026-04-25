"use client";
import { useMemo, useState } from "react";
import type { Recipe } from "@/api/firebase.config";
import RecipeCard from "@/components/recipes/RecipeCard/RecipeCard";

const PROTEIN_TAGS = ["chicken", "beef", "pork", "fish", "seafood", "vegetarian", "vegan"] as const;
const MEAL_TAGS = ["breakfast", "lunch", "dinner", "snack"] as const;
const CUISINE_TAGS = ["italian", "mexican", "asian", "mediterranean", "american", "indian", "french", "middle-eastern"] as const;

type Group = "all" | "meal" | "protein" | "cuisine";

const TagFilter = ({ recipes }: { recipes: Recipe[] }) => {
  const [group, setGroup] = useState<Group>("all");
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!active) return recipes;
    return recipes.filter((r) => (r.tags ?? []).includes(active));
  }, [recipes, active]);

  const chips: readonly string[] =
    group === "protein" ? PROTEIN_TAGS
      : group === "meal" ? MEAL_TAGS
        : group === "cuisine" ? CUISINE_TAGS
          : [];

  function selectGroup(next: Group) {
    setGroup(next);
    setActive(null);
  }

  return (
    <div className="tag-filter">
      <div className="tag-filter__groups">
        {(["all", "meal", "protein", "cuisine"] as Group[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => selectGroup(g)}
            className={`tag-filter__group ${group === g ? "tag-filter__group--active" : ""}`}
          >
            {g === "all" ? "All" : g === "meal" ? "Meal" : g === "protein" ? "Protein" : "Cuisine"}
          </button>
        ))}
      </div>

      {chips.length > 0 && (
        <div className="tag-filter__chips">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(active === c ? null : c)}
              className={`tag-filter__chip ${active === c ? "tag-filter__chip--active" : ""}`}
            >
              {c.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="tag-filter__empty">No recipes match this filter yet - check back soon.</p>
      ) : (
        <div className="recipe-feed__grid">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
