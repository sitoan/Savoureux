import type { RecipeSummary } from "../models/recipeDataType";
import "../styles/recipeDetail.css";

const sampleRecipe: RecipeSummary = {
  id: "2d108c7a-bfc2-4b17-af72-c0e33e2abfc7",
  title: "Mushroom Risotto",
  image:
    "https://i.pinimg.com/736x/ec/29/77/ec29778102e2ace073e9d4db9d359f0d.jpg",
  description: "Creamy Italian rice dish with mixed mushrooms",
  avg_rating: 4.2,
  cooking_time: 45,
  instructions:
    "Sauté mushrooms and onions, toast rice, gradually add warm broth while stirring, finish with cheese.",
  servings: 4,
  category: ["Vegetarian"],
  tags: ["Italian", "Vegetarian", "Comfort Food"],
  ingredients: [
    "arborio rice",
    "mixed mushrooms",
    "vegetable broth",
    "white wine",
    "onion",
    "garlic",
    "parmesan cheese",
    "butter",
    "olive oil",
    "thyme",
    "parsley",
  ],
};

const RecipeDetail = () => {
  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{sampleRecipe.title}</h1>
      <img
        className="recipe-image"
        src={sampleRecipe.image}
        alt={sampleRecipe.title}
      />

      <p className="recipe-description">{sampleRecipe.description}</p>
      <div className="recipe-meta">
        <span>⭐ {sampleRecipe.avg_rating.toFixed(1)}</span>
        <span>⏱ {sampleRecipe.cooking_time} mins</span>
        <span>🍽 {sampleRecipe.servings} servings</span>
      </div>
      <div className="instruction-section">
        <h3>Instruction</h3>
        <p className="instruction">{sampleRecipe.instructions}</p>
      </div>
      <div className="recipe-section">
        <h3>Category</h3>
        <ul className="chip-list">
          {sampleRecipe.category.map((item, i) => (
            <li className="chip" key={i}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Tags</h3>
        <ul className="chip-list">
          {sampleRecipe.tags.map((tag, i) => (
            <li className="chip" key={i}>
              #{tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Ingredients</h3>
        <ul className="ingredient-list">
          {sampleRecipe.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeDetail;
