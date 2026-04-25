import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RecipeDetail from "@/components/recipes/RecipeDetail/RecipeDetail";
import { getRecipeBySlug, getAllRecipeSlugs } from "@/api/firebase.config";
import { brand } from "@/theme/brand.config";

const CUISINE_TAGS = ["italian", "mexican", "asian", "mediterranean", "american", "indian", "french", "middle-eastern"];
const MEAL_TAGS = ["breakfast", "lunch", "dinner", "snack"];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllRecipeSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let recipe = null;
  try { recipe = await getRecipeBySlug(slug); } catch { /* Firestore error */ }
  if (!recipe) {
    return { title: "Recipe not found" };
  }
  const mealType = recipe.tags.find((t) => MEAL_TAGS.includes(t)) ?? "recipe";
  const description = `${recipe.title} - ${recipe.prepTime}-minute ${mealType} with ${recipe.ingredients.length} ingredients.`;
  const url = `${brand.company.site}recipes/${recipe.slug}`;
  return {
    title: recipe.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: recipe.title,
      description,
      url,
      siteName: brand.company.name,
      type: "article",
      images: recipe.imageUrl ? [{ url: recipe.imageUrl, alt: recipe.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description,
      images: recipe.imageUrl ? [recipe.imageUrl] : undefined,
    },
  };
}

function buildRecipeJsonLd(recipe: NonNullable<Awaited<ReturnType<typeof getRecipeBySlug>>>) {
  const createdIso = new Date(recipe.createdAt).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    image: recipe.imageUrl ? [recipe.imageUrl] : undefined,
    datePublished: createdIso,
    author: { "@type": "Organization", name: brand.company.name },
    description: `A ${recipe.prepTime}-minute recipe.`,
    recipeCuisine: (recipe.tags ?? []).find((t) => CUISINE_TAGS.includes(t)) ?? "",
    recipeCategory: (recipe.tags ?? []).find((t) => MEAL_TAGS.includes(t)) ?? "",
    keywords: (recipe.tags ?? []).join(", "),
    totalTime: `PT${recipe.prepTime}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredients.map((i) => `${i.amount} ${i.name}`.trim()),
    recipeInstructions: recipe.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s,
    })),
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  let recipe = null;
  try { recipe = await getRecipeBySlug(slug); } catch { /* Firestore error */ }
  if (!recipe) notFound();

  const jsonLd = buildRecipeJsonLd(recipe);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeDetail recipe={recipe} />
    </>
  );
}
