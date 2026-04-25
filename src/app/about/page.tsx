import type { Metadata } from "next";
import { brand } from "@/theme/brand.config";

export const metadata: Metadata = {
  title: "About",
  description: `What ${brand.company.name} is, and what it isn't.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__kicker">About</div>
          <h1 className="page-hero__title">
            Recipes, without the <em>essay.</em>
          </h1>
          <p className="page-hero__subtitle">
            {brand.company.name} is a growing, ad-free library of quick everyday recipes - each one
            under 30 minutes with 5 to 10 ingredients.
          </p>
        </div>
      </section>
      <section className="page-about">
        <div className="container page-about__body">
          <p>
            Every recipe here is freshly generated and validated against strict rules: realistic
            weeknight timings, small ingredient lists, metric measurements, and steps a tired person
            can follow. If a recipe on this site doesn&apos;t meet those bars, it doesn&apos;t get
            published.
          </p>
          <p>
            There are no pop-ups, no &quot;scroll for the recipe&quot; life stories, no affiliate
            lists disguised as tips. Just the dish.
          </p>
          <p>
            New recipes land twice a day. If there&apos;s something you&apos;d like to see, email{" "}
            <a href={`mailto:${brand.company.email}`}>{brand.company.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
