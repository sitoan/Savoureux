import { useParams } from "react-router-dom";
import "../styles/recipeDetail.css";
import { useEffect, useState } from "react";

export interface recipeDataType {
    id: string;
    title: string;
    description: string;
    image: string;
    ingredients: string[];
    instructions: string;
    cookingTime: number;
    servings: number;
    category: string[];
    totalScore: number;
    numberOfRating: number;
    avgRating: number;
    nutritionalInfo: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number
    };
    comments: {
        text: string;
        userName: string
        timestamp: string
    }[];
    tags: string[];
    shareUrl: string
}

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState<recipeDataType>({
    id: "",
    title: "",
    description: "",
    image: "",
    ingredients: [],
    instructions: "",
    cookingTime: 0,
    servings: 0,
    category: [],
    totalScore: 0,
    numberOfRating: 0,
    avgRating: 0,
    nutritionalInfo: {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
    },
    comments: [],
    tags: [],
    shareUrl: ""
  });
  //fetch data
  useEffect (() => {
    const fetchRecipeData = async () => {
      const response = await fetch("http://127.0.0.1:5000/recipe/" + id);
      const data = await response.json();
      setRecipeData(data);
    };
    fetchRecipeData();
  }, [id]);
  console.log(recipeData);
  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{recipeData.title}</h1>
      <img className="recipe-image" src={recipeData.image} alt={recipeData.title} />

      <p className="recipe-description">{recipeData?.description}</p>
      <div className="recipe-meta">
        <span>⭐ {recipeData.avgRating.toFixed(1)}</span>
        <span>⏱ {recipeData.cookingTime} mins</span>
        <span>🍽 {recipeData.servings} servings</span>
      </div>
      <div className="instruction-section">
        <h3>Instruction</h3>
        <p className="instruction">{recipeData.instructions}</p>
      </div>
      <div className="recipe-section">
        <h3>Category</h3>
        <ul className="chip-list">
          {recipeData.category?.map((item: string, i: number) => (
            <li className="chip" key={i}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Tags</h3>
        <ul className="chip-list">
          {recipeData.tags?.map((tag: string, i: number) => (
            <li className="chip" key={i}>
              #{tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Ingredients</h3>
        <ul className="ingredient-list">
          {recipeData.ingredients?.map((ingredient: string, i: number) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className="recipe-section">
        <h3>Comments</h3>
        {recipeData.comments?.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {recipeData.comments?.map((comment: any, i: number) => (
              <li key={i} className="comment-item">
                <strong>{comment.userName}</strong>:<p>{comment.text}</p>
                <small>{new Date(comment.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
