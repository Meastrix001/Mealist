"use client";
import { useState } from "react";
import Image from "next/image";
import type { Recipe } from "@/api/firebase.config";
import RecipeIngredients from "@/components/recipes/RecipeIngredients/RecipeIngredients";
import NutritionInfo from "@/components/recipes/NutritionInfo/NutritionInfo";
import AllergenBadges from "@/components/recipes/AllergenBadges/AllergenBadges";
import PinButton from "@/components/recipes/PinButton/PinButton";
// import VoteButtons from "@/components/recipes/VoteButtons/VoteButtons";

interface Props {
  recipe: Recipe;
}

const RecipeDetail = ({ recipe }: Props) => {
  const tags = recipe.tags ?? [];
  const ingredients = recipe.ingredients ?? [];
  const steps = recipe.steps ?? [];
  const prepTime = recipe.prepTime ?? 0;
  const baseServings = recipe.servings ?? 1;
  const [servings, setServings] = useState(baseServings);

  return (
    <article className="recipe-detail">
      <header className="recipe-detail__header">
        <div className="container">
          <div className="recipe-detail__tags">
            {tags.map((t) => (
              <span key={t} className="recipe-detail__tag">
                {t.replace(/-/g, " ")}
              </span>
            ))}
          </div>
          <h1 className="recipe-detail__title heading-serif">{recipe.title}</h1>
          <div className="recipe-detail__actions">
            {/* <VoteButtons recipeId={recipe.id} initialUpvotes={recipe.upvotes ?? 0} initialDownvotes={recipe.downvotes ?? 0} /> */}
            <PinButton recipeId={recipe.id} />
          </div>
          <div className="recipe-detail__meta">
            {prepTime > 0 && (
              <>
                <span><strong>{prepTime}</strong> min</span>
                <span className="recipe-detail__dot" aria-hidden>·</span>
              </>
            )}
            <span>Serves <strong>{baseServings}</strong></span>
            {ingredients.length > 0 && (
              <>
                <span className="recipe-detail__dot" aria-hidden>·</span>
                <span><strong>{ingredients.length}</strong> ingredients</span>
              </>
            )}
          </div>
        </div>
      </header>

      {recipe.imageUrl && (
        <div className="recipe-detail__image">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            priority
            className="recipe-detail__img"
          />
        </div>
      )}

      <div className="container recipe-detail__body">
        <div className="recipe-detail__left">
          <RecipeIngredients
            ingredients={ingredients}
            baseServings={baseServings}
            servings={servings}
            onServingsChange={setServings}
          />
          {recipe.nutrition && (
            <NutritionInfo nutrition={recipe.nutrition} servings={servings} />
          )}
          {recipe.allergens && recipe.allergens.length > 0 && (
            <AllergenBadges allergens={recipe.allergens} />
          )}
        </div>

        <section className="recipe-detail__steps">
          <h2 className="recipe-detail__section-title">Steps</h2>
          <ol className="recipe-detail__step-list">
            {steps.map((step, i) => (
              <li key={i} className="recipe-detail__step">
                <span className="recipe-detail__step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};

export default RecipeDetail;
