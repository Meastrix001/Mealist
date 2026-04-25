import type { Recipe } from "@/api/firebase.config";
import TagFilter from "@/components/recipes/TagFilter/TagFilter";

interface Props {
  recipes: Recipe[];
}

const RecipeFeed = ({ recipes }: Props) => {
  if (recipes.length === 0) {
    return (
      <div className="recipe-feed recipe-feed--empty">
        <p>The oven&apos;s warming up. Fresh recipes land every day - check back shortly.</p>
      </div>
    );
  }

  return (
    <section className="recipe-feed">
      <TagFilter recipes={recipes} />
    </section>
  );
};

export default RecipeFeed;
