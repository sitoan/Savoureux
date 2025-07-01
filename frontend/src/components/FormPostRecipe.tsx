// components/FormPostRecipe.tsx
import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useRecipe, type RecipeFormData } from "../context/crudContext";
import "../styles/formPostRecipe.css";

const tagOptions = [
  "mainCourse",
  "slowCooker",
  "quickMeal",
  "healthy",
  "vegetarian",
  "mealPrep",
];

// Draggable tag component
function DraggableTag({ id }: { id: string }) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id,
    data: { content: id },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="draggable-tag"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {id}
    </div>
  );
}

// Droppable area for tags
function DroppableTagArea({
  tags,
  onTagRemove,
}: {
  tags: string[];
  onTagRemove: (tag: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "tags" });

  return (
    <div
      ref={setNodeRef}
      className={`tags-drop-area ${isOver ? "drag-over" : ""}`}
    >
      {tags.length === 0 ? (
        <span className="placeholder">Drag tags here...</span>
      ) : (
        tags.map((tag, index) => (
          <span key={index} className="selected-tag">
            {tag}
            <button
              type="button"
              onClick={() => onTagRemove(tag)}
              className="tag-remove-btn"
            >
              ×
            </button>
          </span>
        ))
      )}
    </div>
  );
}

const FormPostRecipe: React.FC = () => {
  const { 
    categoryOptions, 
    editingRecipe, 
    createRecipe, 
    updateRecipe, 
    setEditingRecipe 
  } = useRecipe();

  const [form, setForm] = useState<RecipeFormData>({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    cooking_time: 0,
    servings: 1,
    category: "",
    tags: [],
    image: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      ingredients: [""],
      instructions: "",
      cooking_time: 0,
      servings: 1,
      category: "",
      tags: [],
      image: "",
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    });
  };

  // Fill form with editing recipe data
  useEffect(() => {
    if (editingRecipe) {
      setForm({
        title: editingRecipe.title,
        description: editingRecipe.description,
        ingredients: editingRecipe.ingredients.length > 0 ? editingRecipe.ingredients : [""],
        instructions: editingRecipe.instructions,
        cooking_time: editingRecipe.cooking_time,
        servings: editingRecipe.servings,
        category: editingRecipe.category,
        tags: editingRecipe.tags,
        image: editingRecipe.image,
        calories: editingRecipe.nutritional_info.calories,
        carbs: editingRecipe.nutritional_info.carbs,
        fat: editingRecipe.nutritional_info.fat,
        protein: editingRecipe.nutritional_info.protein,
      });
    }
  }, [editingRecipe]);

  const addTagManually = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !form.tags.includes(trimmedTag)) {
      setForm({ ...form, tags: [...form.tags, trimmedTag] });
    }
    setNewTag("");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...form.ingredients];
    newIngredients[index] = value;
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setForm({ ...form, ingredients: [...form.ingredients, ""] });
  };

  const removeIngredient = (index: number) => {
    if (form.ingredients.length > 1) {
      const newIngredients = form.ingredients.filter((_, i) => i !== index);
      setForm({ ...form, ingredients: newIngredients });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over?.id === "tags" && active.data?.current?.content) {
      const content = active.data.current.content;
      if (!form.tags.includes(content)) {
        setForm({
          ...form,
          tags: [...form.tags, content],
        });
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm({
      ...form,
      tags: form.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, form);
      } else {
        await createRecipe(form);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
  };

  const cancelEdit = () => {
    setEditingRecipe(null);
    resetForm();
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="form-post-recipe">
        <h2>{editingRecipe ? "Edit Recipe" : "Create New Recipe"}</h2>
        <div className="form-grid">
          {/* Title - Required */}
          <div className="form-group full">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? "error-input" : ""}
              placeholder="Enter recipe title"
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          {/* Description - Optional */}
          <div className="form-group full">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your recipe (optional)"
            />
          </div>

          {/* Ingredients - Dynamic List */}
          <div className="form-group full">
            <label>Ingredients</label>
            {form.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  className="ingredient-input"
                  placeholder={`Ingredient ${index + 1}`}
                />
                {form.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="add-btn">
              + Add Ingredient
            </button>
          </div>

          {/* Instructions - Text Area */}
          <div className="form-group full">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Step-by-step cooking instructions"
              style={{ minHeight: "120px" }}
            />
          </div>

          {/* Cooking Time - Number Input */}
          <div className="form-group">
            <label>Cooking Time (minutes)</label>
            <input
              type="number"
              name="cooking_time"
              value={form.cooking_time}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Servings - Number Input */}
          <div className="form-group">
            <label>Servings</label>
            <input
              type="number"
              name="servings"
              value={form.servings}
              onChange={handleChange}
              min="1"
            />
          </div>

          {/* Category - Dropdown */}
          <div className="form-group full">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags - Drag and Drop inline */}
          <div className="form-group full">
            <label>Tags</label>
            <div className="tags-input-container">
              {/* Tag Drop Area */}
              <div className="form-group">
                <DroppableTagArea tags={form.tags} onTagRemove={removeTag} />

                {/* Input for new tag */}
                <div className="manual-tag-input">
                  <input
                    type="text"
                    placeholder="Add new tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTagManually();
                      }
                    }}
                  />
                  <button type="button" onClick={addTagManually}>
                    Add
                  </button>
                </div>
              </div>

              {/* Draggable Tags */}
              <div className="available-tags">
                <div className="tags-sidebar">
                  <h4>Available Tags</h4>
                  {tagOptions.map((tag) => (
                    <DraggableTag key={tag} id={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div className="form-group full">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Nutritional Info */}
          <fieldset className="form-group-nutrition full">
            <legend>Nutritional Info</legend>
            <div className="form-nutrition-grid">
              <div className="form-group">
                <label>Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={form.calories}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={form.carbs}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Fat (g)</label>
                <input
                  type="number"
                  name="fat"
                  value={form.fat}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={form.protein}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="form-actions full">
            <button type="button" onClick={handleSubmit}>
              {editingRecipe ? "Update Recipe" : "Submit Recipe"}
            </button>
            {editingRecipe && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default FormPostRecipe;