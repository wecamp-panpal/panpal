import "./recipeCard.css";

type Props = {
  title: string;
  author: string;
  imageUrl: string;
  rating?: number;
  votes: number;
};

export default function RecipeCard({ title, author, imageUrl, rating }: Props) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__image">
        <img src={imageUrl} alt={title} loading="lazy" />
      </div>

      <div className="recipe-card__meta">
        <div className="recipe-card__top">
          <h3 className="recipe-card__title">{title}</h3>
          <div className="recipe-card__rating">
            {(rating ?? 0).toFixed(1)} <span aria-hidden>☆</span>
          </div>
        </div>

        <div className="recipe-card__author">@{author.replace(/^@/, "")}</div>
      </div>
    </article>
  );
}