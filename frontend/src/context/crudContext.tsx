// contexts/RecipeContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './authContext';

// Recipe type definition
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  servings: number;
  category: string;
  avg_rating: number;
  tags: string[];
  image: string;
  nutritional_info: {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  };
  created_at?: string;
}

// Form data type
export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  servings: number;
  category: string;
  tags: string[];
  image: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

// Context type
interface RecipeContextType {
  // State
  recipes: Recipe[];
  loading: boolean;
  categoryOptions: string[];
  editingRecipe: Recipe | null;
  
  // Actions
  fetchRecipes: () => Promise<void>;
  createRecipe: (formData: RecipeFormData) => Promise<void>;
  updateRecipe: (id: string, formData: RecipeFormData) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  setEditingRecipe: (recipe: Recipe | null) => void;
  fetchCategories: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const { userId } = useAuth();
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/category/title");
      const data = await response.json();
      setCategoryOptions(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRecipes = async () => {
    console.log(userId);
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/recipe/all/" + userId);
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (formData: RecipeFormData) => {
    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.filter((i) => i.trim() !== ""),
        nutritional_info: {
          calories: formData.calories,
          carbs: formData.carbs,
          fat: formData.fat,
          protein: formData.protein,
        },
      };

      const response = await fetch("http://127.0.0.1:5000/recipe/create/" + userId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        await fetchRecipes(); // Refresh recipes list
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const updateRecipe = async (id: string, formData: RecipeFormData) => {
    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.filter((i) => i.trim() !== ""),
        nutritional_info: {
          calories: formData.calories,
          carbs: formData.carbs,
          fat: formData.fat,
          protein: formData.protein,
        },
      };

      const response = await fetch(`http://127.0.0.1:5000/recipe/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setEditingRecipe(null);
        await fetchRecipes(); // Refresh recipes list
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/recipe/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        await fetchRecipes(); // Refresh recipes list
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  const value: RecipeContextType = {
    recipes,
    loading,
    categoryOptions,
    editingRecipe,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    setEditingRecipe,
    fetchCategories,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};