import type { RecipeNutrition } from "@/api/firebase.config";

interface Props {
  nutrition: RecipeNutrition;
  servings: number;
}

const NutritionInfo = ({ nutrition, servings }: Props) => {
  return (
    <section className="nutrition">
      <h2 className="recipe-detail__section-title">Nutrition</h2>
      <p className="nutrition__note">Per serving · {servings} {servings === 1 ? "serving" : "servings"} total</p>
      <div className="nutrition__grid">
        <div className="nutrition__item nutrition__item--primary">
          <span className="nutrition__value">{nutrition.kcalPerServing}</span>
          <span className="nutrition__label">kcal</span>
        </div>
        <div className="nutrition__item">
          <span className="nutrition__value">{nutrition.proteinG}g</span>
          <span className="nutrition__label">Protein</span>
        </div>
        <div className="nutrition__item">
          <span className="nutrition__value">{nutrition.carbsG}g</span>
          <span className="nutrition__label">Carbs</span>
        </div>
        <div className="nutrition__item">
          <span className="nutrition__value">{nutrition.fatG}g</span>
          <span className="nutrition__label">Fat</span>
        </div>
        <div className="nutrition__item">
          <span className="nutrition__value">{nutrition.fiberG}g</span>
          <span className="nutrition__label">Fibre</span>
        </div>
      </div>
      <p className="nutrition__note nutrition__note--secondary">{nutrition.kcalPer100g} kcal / 100g</p>
    </section>
  );
};

export default NutritionInfo;
