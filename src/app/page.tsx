import RecipeFeed from "@/components/recipes/RecipeFeed/RecipeFeed";
// import GenerateButton from "@/components/admin/GenerateButton";
import { getRecentRecipes } from "@/api/firebase.config";
import { brand } from "@/theme/brand.config";

export const revalidate = 600;

export default async function LandingPage() {
  let recipes: Awaited<ReturnType<typeof getRecentRecipes>> = [];
  try {
    recipes = await getRecentRecipes(48);
  } catch {
    // Firestore unavailable - render empty feed rather than crash
  }

  return (
    <div className="landing">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__kicker">{brand.company.name}</div>
          <h1 className="page-hero__title">
            Weeknight recipes, <em>actually</em> fast.
          </h1>
          <p className="page-hero__subtitle">
            {brand.company.description}
          </p>
        </div>
      </section>
      <div className="container">
        <RecipeFeed recipes={recipes} />
      </div>
      {/* <GenerateButton /> */}
    </div>
  );
}
