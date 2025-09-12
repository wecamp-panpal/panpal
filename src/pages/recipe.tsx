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
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const list = [...recipes];

    const byCategory = ["Dessert", "Drink", "Main dish", "Party", "Vegan"] as const;
    const wantsAnyCategory = byCategory.some((c) => selected.has(c as Chip));
    const wantsVN = selected.has("Vietnamese Cuisine");
    const under30 = selected.has("Under 30 minutes");
    const under15 = selected.has("Under 15 minutes");

    let out = list;

    if (wantsAnyCategory || wantsVN) {
      out = out.filter((r) => {
        const okCat = byCategory.every((c) => !selected.has(c as Chip) || r.category === c);
        const okCuisine = !wantsVN || r.cuisine === "Vietnamese";
        return okCat && okCuisine;
      });
    }

    if (under15) out = out.filter((r) => (r.cookTimeMin ?? 9999) <= 15);
    else if (under30) out = out.filter((r) => (r.cookTimeMin ?? 9999) <= 30);

    if (selected.has("Rating")) {
      out.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return out;
  }, [recipes, selected]);

  const trendingAll = useMemo(() => {
    const list = [...recipes].sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      if ((b.rating ?? 0) !== (a.rating ?? 0)) return (b.rating ?? 0) - (a.rating ?? 0);
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [recipes]);

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

  const scrollNext = () => railRef.current?.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  const scrollPrev = () => railRef.current?.scrollBy({ left: -scrollAmount(), behavior: "smooth" });

  useEffect(() => {
    updateArrows();
  }, [trendingTop10]);

  const COLUMNS = 4;
  const ROWS = 4;
  const RECIPES_PER_PAGE = COLUMNS * ROWS;

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filtered.length / RECIPES_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * RECIPES_PER_PAGE;
    const end = start + RECIPES_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [selected]);

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
          <div className="carousel__rail" ref={railRef} onScroll={updateArrows}>
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

      <section className="all-recipes">
        <h2 className="h-title all-recipes__title">All Recipes</h2>

        <div className="all-recipes__grid">
          {paginated.length === 0 ? (
            <p>No recipes match the current filter.</p>
          ) : (
            paginated.map((r) => (
              <div key={r.id} className="carousel__item">
                <RecipeCard
                  title={r.title}
                  author={r.author}
                  imageUrl={r.imageUrl}
                  rating={r.rating}
                  votes={r.votes}
                />
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="all-recipes__pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}