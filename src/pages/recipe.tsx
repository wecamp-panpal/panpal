import { useEffect, useMemo, useRef, useState } from "react";
import "./recipe.css";
import { fetchRecipes } from "../services/recipes";
import type { Recipe } from "../services/recipes";
import RecipeCard from "../components/recipeCard";

type Chip =
  | "Dessert"
  | "Drink"
  | "Main dish"
  | "Rating"
  | "Party"
  | "Under 30 minutes"
  | "Under 15 minutes"
  | "Vietnamese Cuisine"
  | "Vegan";

const CHIPS: Chip[] = [
  "Dessert",
  "Drink",
  "Main dish",
  "Rating",
  "Party",
  "Under 30 minutes",
  "Under 15 minutes",
  "Vietnamese Cuisine",
  "Vegan",
];

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Set<Chip>>(new Set());
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  function toggleChip(chip: Chip) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const list = [...recipes];

    const byCategory = ["Dessert", "Drink", "Main dish", "Party", "Vegan"] as const;
    const wantsAnyCategory = byCategory.some(c => selected.has(c as Chip));
    const wantsVN = selected.has("Vietnamese Cuisine");
    const under30 = selected.has("Under 30 minutes");
    const under15 = selected.has("Under 15 minutes");

    let out = list;

    if (wantsAnyCategory || wantsVN) {
      out = out.filter(r => {
        const okCat = byCategory.every(c => !selected.has(c as Chip) || r.category === c);
        const okCuisine = !wantsVN || r.cuisine === "Vietnamese";
        return okCat && okCuisine;
      });
    }

    if (under15) out = out.filter(r => (r.cookTimeMin ?? 9999) <= 15);
    else if (under30) out = out.filter(r => (r.cookTimeMin ?? 9999) <= 30);

    if (selected.has("Rating")) {
      out.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return out;
  }, [recipes, selected]);

    const trendingAll = useMemo(() => {
    const list = [...filtered].sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      if ((b.rating ?? 0) !== (a.rating ?? 0)) return (b.rating ?? 0) - (a.rating ?? 0);
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [filtered]);

  const trendingTop10 = useMemo(() => trendingAll.slice(0, 10), [trendingAll]);

  const updateArrows = () => {
    const rail = railRef.current;
    if (!rail) return;
    const { scrollLeft, scrollWidth, clientWidth } = rail;
    setCanPrev(scrollLeft > 0);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollAmount = () => {
    const rail = railRef.current;
    if (!rail) return 320;
    return Math.max(rail.clientWidth * 0.9, 320);
  };

  const scrollNext = () => railRef.current?.scrollBy({ left:  scrollAmount(), behavior: "smooth" });
  const scrollPrev = () => railRef.current?.scrollBy({ left: -scrollAmount(), behavior: "smooth" });

  useEffect(() => {
    updateArrows();
  }, [trendingTop10]);


  return (
    <main className="recipe-page app-container">
      <section className="filter">
        <div className="filter__header">
          <h2 className="h-title filter__title">Filter By</h2>
          {selected.size > 0 && (
            <button
              className="filter__clear"
              onClick={() => setSelected(new Set())}
              disabled={selected.size === 0}
            >
              Clear all
            </button>
          )}
        </div>
        <div className="filter__chips">
          {CHIPS.map((chip) => {
            const active = selected.has(chip);
            return (
              <button
                key={chip}
                className={`chip ${active ? "is-active" : ""}`}
                onClick={() => toggleChip(chip)}
                aria-pressed={active}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      <section className="trending">
        <h2 className="h-title trending__title">Trending</h2>

        <div className="carousel__viewport">
          <div
            className="carousel__rail"
            ref={railRef}
            onScroll={updateArrows}
          >
            {trendingTop10.map((r) => (
              <div className="carousel__item" key={r.id}>
                <RecipeCard
                  title={r.title}
                  author={r.author}
                  imageUrl={r.imageUrl}
                  rating={r.rating}
                  votes={r.votes}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="carousel__controls">
          <button
            className="carousel__btn"
            aria-label="Previous"
            onClick={scrollPrev}
            disabled={!canPrev}
          >
            ←
          </button>
          <button
            className="carousel__btn"
            aria-label="Next"
            onClick={scrollNext}
            disabled={!canNext}
          >
            →
          </button>
        </div>
      </section>
    </main>
  );
}