import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "@/api/firebase.config";
import PinButton from "@/components/recipes/PinButton/PinButton";

interface Props {
  recipe: Recipe;
  priority?: boolean;
}

const RecipeCard = ({ recipe, priority = false }: Props) => {
  const tags = recipe.tags ?? [];

  return (
    <div className="recipe-card">
      <Link href={`/recipes/${recipe.slug}`} className="recipe-card__link" prefetch={false} aria-label={recipe.title}>
        <div className="recipe-card__image">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="recipe-card__img"
            />
          ) : (
            <div className="recipe-card__img recipe-card__img--placeholder" />
          )}
          {recipe.prepTime > 0 && (
            <div className="recipe-card__meta">
              <span className="recipe-card__time">{recipe.prepTime} min</span>
            </div>
          )}
        </div>
        <div className="recipe-card__body">
          <h3 className="recipe-card__title">{recipe.title}</h3>
          <div className="recipe-card__tags">
            {tags.slice(0, 3).map((t) => (
              <span key={t} className="recipe-card__tag">
                {t.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <PinButton recipeId={recipe.id} className="recipe-card__pin" />
    </div>
  );
};

export default RecipeCard;
