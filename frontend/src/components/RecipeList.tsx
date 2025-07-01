// components/RecipeList.tsx
import React, { useState } from "react";
import { useRecipe, type Recipe } from "../context/crudContext";
import "../styles/recipeList.css";

// Recipe Card Component
const RecipeEditCard: React.FC<{
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}> = ({ recipe, onEdit, onDelete }) => {
  return (
    <div className="recipe-card-edit">
      {recipe.image && (
        <div className="recipe-image-edit">
          <img src={recipe.image} alt={recipe.title} />
        </div>
      )}
      <div className="recipe-content-edit">
        <h3 className="recipe-title-edit">{recipe.title}</h3>
        <p className="recipe-description-edit">{recipe.description}</p>

        <div className="recipe-meta-edit">
          <span className="recipe-time-edit">⏱️ {recipe.cooking_time} min</span>
          <span className="recipe-servings-edit">👥 {recipe.servings} servings</span>
          {recipe.category && (
            <span className="recipe-category-edit">📁 {recipe.category}</span>
          )}
        </div>

        {recipe.tags.length > 0 && (
          <div className="recipe-tags-edit">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="recipe-tag-edit">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="recipe-nutrition-edit">
          <span>🔥 {recipe.nutritional_info.calories} cal</span>
          <span>🍞 {recipe.nutritional_info.carbs}g</span>
          <span>🥑 {recipe.nutritional_info.fat}g</span>
          <span>🥩 {recipe.nutritional_info.protein}g</span>
        </div>

        <div className="recipe-actions-edit">
          <button className="edit-btn-edit" onClick={() => onEdit(recipe)}>
            Edit
          </button>
          <button className="delete-btn-edit" onClick={() => onDelete(recipe.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const RecipeList: React.FC = () => {
  const { recipes, loading, categoryOptions, deleteRecipe, setEditingRecipe } =
    useRecipe();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || recipe.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="recipes-list-container-edit">
      <div className="recipes-header-edit">
        <h3>Your Recipes ({recipes.length})</h3>

        {/* Search and Filter */}
        <div className="recipes-filters-edit">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-edit"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select-edit"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="recipes-list-edit">
        {loading ? (
          <div className="loading-edit">Loading recipes...</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="no-recipes-edit">
            {searchTerm || filterCategory
              ? "No recipes match your filters"
              : "No recipes yet. Create your first recipe!"}
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeEditCard
              key={recipe.id}
              recipe={recipe}
              onEdit={handleEditRecipe}
              onDelete={deleteRecipe}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeList;