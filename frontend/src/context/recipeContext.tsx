import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  recipeCommentType,
  recipeInfoType,
  recipeIngredientType,
  recipeRatingType,
} from "../models/recipeDataType";

// ------------------------ CONTEXT TYPES ------------------------
type RecipeMap<T> = Record<string, T>;

type RecipeInfoContextType = {
  recipeInfoMap: RecipeMap<recipeInfoType>;
  updateRecipeInfo: (id: string, data: recipeInfoType) => void;
};

type RecipeIngredientContextType = {
  recipeIngredientMap: RecipeMap<recipeIngredientType>;
  updateRecipeIngredient: (id: string, data: recipeIngredientType) => void;
};

type RecipeRatingContextType = {
  recipeRatingMap: RecipeMap<recipeRatingType>;
  updateRecipeRating: (id: string, data: recipeRatingType) => void;
};

type RecipeCommentContextType = {
  recipeCommentMap: RecipeMap<recipeCommentType>;
  updateRecipeComment: (id: string, data: recipeCommentType) => void;
};

// ------------------------ CONTEXT DEFINITIONS ------------------------
const RecipeInfoContext = createContext<RecipeInfoContextType | null>(null);
const RecipeIngredientContext =
  createContext<RecipeIngredientContextType | null>(null);
const RecipeRatingContext = createContext<RecipeRatingContextType | null>(null);
const RecipeCommentContext = createContext<RecipeCommentContextType | null>(
  null
);

// ------------------------ HOOKS ------------------------
export const useRecipeInfoContext = () => {
  const context = useContext(RecipeInfoContext);
  if (!context)
    throw new Error("useRecipeInfoContext must be used inside provider");
  return context;
};
export const useRecipeIngredientContext = () => {
  const context = useContext(RecipeIngredientContext);
  if (!context)
    throw new Error("useRecipeIngredientContext must be used inside provider");
  return context;
};
export const useRecipeRatingContext = () => {
  const context = useContext(RecipeRatingContext);
  if (!context)
    throw new Error("useRecipeRatingContext must be used inside provider");
  return context;
};
export const useRecipeCommentContext = () => {
  const context = useContext(RecipeCommentContext);
  if (!context)
    throw new Error("useRecipeCommentContext must be used inside provider");
  return context;
};

// ------------------------ PROVIDER ------------------------
export const RecipeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recipeInfoMap, setRecipeInfoMap] = useState<RecipeMap<recipeInfoType>>(
    {}
  );
  const [recipeIngredientMap, setRecipeIngredientMap] = useState<
    RecipeMap<recipeIngredientType>
  >({});
  const [recipeRatingMap, setRecipeRatingMap] = useState<
    RecipeMap<recipeRatingType>
  >({});
  const [recipeCommentMap, setRecipeCommentMap] = useState<
    RecipeMap<recipeCommentType>
  >({});

  const updateRecipeInfo = (id: string, data: recipeInfoType) => {
    setRecipeInfoMap((prev) => ({ ...prev, [id]: data }));
  };
  const updateRecipeIngredient = (id: string, data: recipeIngredientType) => {
    setRecipeIngredientMap((prev) => ({ ...prev, [id]: data }));
  };
  const updateRecipeRating = (id: string, data: recipeRatingType) => {
    setRecipeRatingMap((prev) => ({ ...prev, [id]: data }));
  };
  const updateRecipeComment = (id: string, data: recipeCommentType) => {
    setRecipeCommentMap((prev) => ({ ...prev, [id]: data }));
  };

  // ---------------- FETCH ALL DATA ----------------
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/recipe/all");
        const data = await response.json();

        const infoMap: RecipeMap<recipeInfoType> = {};
        const ingredientMap: RecipeMap<recipeIngredientType> = {};
        const ratingMap: RecipeMap<recipeRatingType> = {};
        const commentMap: RecipeMap<recipeCommentType> = {};

        data.forEach((recipe: any) => {
          infoMap[recipe.id] = {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            image: recipe.image,
            instructions: recipe.instructions,
            cookingTime: recipe.cooking_time,
            servings: recipe.servings,
            category: recipe.category,
            nutritionalInfo: recipe.nutritional_info,
            tags: recipe.tags,
            shareUrl: recipe.share_url,
          };
          ingredientMap[recipe.id] = recipe.ingredients;
          ratingMap[recipe.id] = {
            totalScore: recipe.total_score,
            numberOfRating: recipe.number_of_rating,
            avgRating: recipe.avg_rating,
          };
          commentMap[recipe.id] = recipe.comments;
        });

        setRecipeInfoMap(infoMap);
        setRecipeIngredientMap(ingredientMap);
        setRecipeRatingMap(ratingMap);
        setRecipeCommentMap(commentMap);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipeData();
  }, []);

  return (
    <RecipeInfoContext.Provider value={{ recipeInfoMap, updateRecipeInfo }}>
      <RecipeIngredientContext.Provider
        value={{ recipeIngredientMap, updateRecipeIngredient }}
      >
        <RecipeRatingContext.Provider
          value={{ recipeRatingMap, updateRecipeRating }}
        >
          <RecipeCommentContext.Provider
            value={{ recipeCommentMap, updateRecipeComment }}
          >
            {children}
          </RecipeCommentContext.Provider>
        </RecipeRatingContext.Provider>
      </RecipeIngredientContext.Provider>
    </RecipeInfoContext.Provider>
  );
};
