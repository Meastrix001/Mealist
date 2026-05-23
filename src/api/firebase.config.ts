import { initializeApp, getApps, getApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firestoreDB = getFirestore(app);

const functions = getFunctions(app, "europe-west1");
export const callGenerateRecipe = () =>
  httpsCallable(functions, "mealistGenerateNow")();

type VoteAction = "upvote" | "downvote" | null;
export const callVoteRecipe = (recipeId: string, action: VoteAction, previous: VoteAction) =>
  httpsCallable(functions, "mealistVoteRecipe")({ recipeId, action, previous });

const RECIPES_COLLECTION = "mealist_recipes";

export interface RecipeIngredient {
  amount: string;
  name: string;
  shoppingName?: string;
  normalized?: string;
  scalingFactor?: number;
}

export interface RecipeNutrition {
  kcalPerServing: number;
  kcalPer100g: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  ingredients: RecipeIngredient[];
  ingredientsNormalized: string[];
  ingredientSetHash: string;
  steps: string[];
  prepTime: number;
  servings: number;
  tags: string[];
  imageUrl: string;
  imagePrompt: string;
  createdAt: number;
  allergens?: string[];
  nutrition?: RecipeNutrition;
  upvotes?: number;
  downvotes?: number;
}

function snapshotToRecipe(id: string, data: Record<string, unknown>): Recipe {
  const raw = data as Omit<Recipe, "id" | "createdAt"> & { createdAt?: Timestamp };
  return {
    ...raw,
    id,
    createdAt: raw.createdAt instanceof Timestamp ? raw.createdAt.toMillis() : Date.now(),
  };
}

export async function getRecentRecipes(count: number = 24): Promise<Recipe[]> {
  const q = query(
    collection(firestoreDB, RECIPES_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapshotToRecipe(d.id, d.data()));
}

export async function getRecipesAfter(afterTimestamp: number, count: number = 1): Promise<Recipe[]> {
  const q = query(
    collection(firestoreDB, RECIPES_COLLECTION),
    orderBy("createdAt", "desc"),
    startAfter(afterTimestamp),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapshotToRecipe(d.id, d.data()));
}

export async function getRecipesByTag(value: string, count: number = 24): Promise<Recipe[]> {
  const q = query(
    collection(firestoreDB, RECIPES_COLLECTION),
    where("tags", "array-contains", value),
    orderBy("createdAt", "desc"),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => snapshotToRecipe(d.id, d.data()));
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const q = query(
    collection(firestoreDB, RECIPES_COLLECTION),
    where("slug", "==", slug),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return snapshotToRecipe(d.id, d.data());
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const ref = doc(firestoreDB, RECIPES_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snapshotToRecipe(snap.id, snap.data());
}

export async function getRecipesByIds(ids: string[]): Promise<Recipe[]> {
  const results = await Promise.all(ids.map((id) => getRecipeById(id)));
  return results.filter((r): r is Recipe => r !== null);
}

export async function getAllRecipeSlugs(): Promise<string[]> {
  const snap = await getDocs(collection(firestoreDB, RECIPES_COLLECTION));
  return snap.docs.map((d) => (d.data() as { slug: string }).slug).filter(Boolean);
}
