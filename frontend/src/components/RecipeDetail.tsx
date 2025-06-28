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
    carbs: number;
  };
  comments: {
    text: string;
    userName: string;
    timestamp: string;
  }[];
  tags: string[];
  shareUrl: string;
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
      carbs: 0,
    },
    comments: [],
    tags: [],
    shareUrl: "",
  });
  //fetch data

  useEffect(() => {
    if (!id) return;
    const fetchRecipeData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/recipe/" + id);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const mappedData: recipeDataType = {
          id: data.id,
          title: data.title || "", 
          description: data.description || "",
          image: data.image || "",
          ingredients: data.ingredients || [],
          instructions: data.instructions || "",
          cookingTime: data.cooking_time || 0,
          servings: data.servings || 0,
          category: data.category || [],
          totalScore: data.total_score || 0,
          numberOfRating: data.number_of_rating || 0,
          avgRating: data.avg_rating || 0,
          nutritionalInfo: {
            calories: data.nutritional_info?.calories || 0,
            protein: data.nutritional_info?.protein || 0,
            fat: data.nutritional_info?.fat || 0,
            carbs: data.nutritional_info?.carbs || 0
          },
          comments: data.comments || [],
          tags: data.tags || [],
          shareUrl: data.share_url || ""
        };
        setRecipeData(mappedData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchRecipeData();
  }, [id]);

  console.log(recipeData);
  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{recipeData?.title || "Loading..."}</h1>

      {recipeData.image && (
        <img
          className="recipe-image"
          src={recipeData.image}
          alt={recipeData.title}
        />
      )}

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
        {recipeData?.ingredients?.length > 0 ? (
          <ul className="ingredient-list">
            {recipeData.ingredients?.map((ingredient: string, i: number) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p>No ingredients yet.</p>
        )}
      </div>
      <div className="recipe-section">
        <h3>Comments</h3>
        {recipeData.comments?.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {recipeData.comments?.map((comment: any, i: number) => (
              <li key={i} className="comment-item">
                <strong>{comment.username}</strong>:<p>{comment.text}</p>
                <small>
                  {comment.timestamp
                    ? new Date(comment.timestamp).toLocaleString()
                    : "Invalid date"}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
