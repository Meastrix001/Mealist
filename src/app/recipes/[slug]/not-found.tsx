import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <h1>Recipe not found</h1>
      <p>That dish must have been eaten. Try browsing something else.</p>
      <Link href="/" className="ml-label">
        ← Back to all recipes
      </Link>
    </div>
  );
}
