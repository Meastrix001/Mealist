const ALLERGEN_LABELS: Record<string, { label: string; icon: string }> = {
  gluten:      { label: "Gluten",      icon: "🌾" },
  crustaceans: { label: "Crustaceans", icon: "🦐" },
  eggs:        { label: "Eggs",        icon: "🥚" },
  fish:        { label: "Fish",        icon: "🐟" },
  peanuts:     { label: "Peanuts",     icon: "🥜" },
  soya:        { label: "Soya",        icon: "🫘" },
  dairy:       { label: "Dairy",       icon: "🥛" },
  nuts:        { label: "Nuts",        icon: "🌰" },
  celery:      { label: "Celery",      icon: "🥬" },
  mustard:     { label: "Mustard",     icon: "🟡" },
  sesame:      { label: "Sesame",      icon: "🌿" },
  sulphites:   { label: "Sulphites",   icon: "🍷" },
  lupin:       { label: "Lupin",       icon: "🌼" },
  molluscs:    { label: "Molluscs",    icon: "🐚" },
};

interface Props {
  allergens: string[];
}

const AllergenBadges = ({ allergens }: Props) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <section className="allergens">
      <h2 className="recipe-detail__section-title">Allergens</h2>
      <div className="allergens__list">
        {allergens.map((a) => {
          const meta = ALLERGEN_LABELS[a];
          if (!meta) return null;
          return (
            <span key={a} className="allergens__badge">
              <span className="allergens__icon" aria-hidden>{meta.icon}</span>
              {meta.label}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default AllergenBadges;
