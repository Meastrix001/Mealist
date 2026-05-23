"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMealistStore } from "@/store/mealist.store";
import { getRecipesByIds, type Recipe } from "@/api/firebase.config";
import RecipeCard from "@/components/recipes/RecipeCard/RecipeCard";

export default function SavedPage() {
  const pinnedIds = useMealistStore((s) => s.pinnedIds);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pinnedIds.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getRecipesByIds(pinnedIds).then((r) => {
      setRecipes(r);
      setLoading(false);
    });
  }, [pinnedIds]);

  return (
    <div className="saved-page">
      <div className="container">
        <div className="saved-page__header">
          <h1 className="saved-page__title heading-serif">Saved recipes</h1>
          {!loading && recipes.length > 0 && (
            <p className="saved-page__count">{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}</p>
          )}
        </div>

        {loading && (
          <div className="saved-page__loading">
            <div className="recipe-feed__spinner" />
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="saved-page__empty">
            <p>No saved recipes yet.</p>
            <Link href="/" className="saved-page__cta">Browse recipes</Link>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="recipe-feed__grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
