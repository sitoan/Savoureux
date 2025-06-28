import React, { useState } from "react";
import "../styles/formPostRecipe.css";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";

const categoryTags = ["USA", "Asean", "Korean"];
const tagOptions = ["fyb", "goodfood", "aaaa"];

// Draggable category tag
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
      style={{
        padding: "6px 12px",
        margin: "6px 4px",
        background: "#0077b6",
        color: "#fff",
        borderRadius: "16px",
        display: "inline-block",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "grab",
        transition: "background-color 0.2s ease",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {id}
    </div>
  );
}

// Droppable input for category
function DroppableInput({
  id,
  value,
  onChange,
  onDrop,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onDrop: (val: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <input
      ref={setNodeRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px",
        fontSize: "14px",
        backgroundColor: "#fff",
        color: "black",
        border: isOver ? "2px dashed #00bfff" : "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  );
}

export default function FormPostRecipe() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    cooking_time: 0,
    servings: 1,
    avg_rating: 0,
    number_of_rating: 0,
    ingredients: "",
    instructions: "",
    category: "",
    tags: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const content = active.data?.current?.content;

    if (!over || !content) return;

    if (over.id === "categories") {
      const current = form.category.split(",").map((s) => s.trim());
      if (!current.includes(content)) {
        setForm({
          ...form,
          category: [...current, content].join(", "),
        });
      }
    }

    if (over.id === "tags") {
      const current = form.tags.split(",").map((s) => s.trim());
      if (!current.includes(content)) {
        setForm({
          ...form,
          tags: [...current, content].join(", "),
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = {
      ...form,
      ingredients: form.ingredients.split(",").map((i) => i.trim()),
      category: form.category.split(",").map((c) => c.trim()),
      tags: form.tags.split(",").map((t) => t.trim()),
      nutritional_info: {
        calories: form.calories,
        carbs: form.carbs,
        fat: form.fat,
        protein: form.protein,
      },
    };
    console.log("Submitted recipe:", result);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="form-container-with-tags">
        <div>
          <div className="tag-list-panel categories">
            <h4>Categories</h4>
            {categoryTags.map((cat) => (
              <DraggableTag key={cat} id={cat} />
            ))}
          </div>
          <div className="tag-list-panel tags">
            <h4>Tags</h4>
            {tagOptions.map((tag) => (
              <DraggableTag key={tag} id={tag} />
            ))}
          </div>
        </div>

        <form className="form-post-recipe" onSubmit={handleSubmit}>
          <h2>Post New Recipe</h2>
          <div className="form-grid">
            <div className="form-group full">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="categoy-input form-group full">
              <label>Category (drag tags here)</label>
              <DroppableInput
                id="categories"
                value={form.category}
                onChange={(val) => setForm({ ...form, category: val })}
                onDrop={(val) => {
                  const current = form.category.split(",").map((s) => s.trim());
                  if (!current.includes(val)) {
                    setForm({
                      ...form,
                      category: [...current, val].join(", "),
                    });
                  }
                }}
              />
            </div>

            <div className="form-group full">
              <label>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Cooking Time (mins)</label>
              <input
                type="number"
                name="cooking_time"
                value={form.cooking_time}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={form.servings}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Number of Ratings</label>
              <input
                type="number"
                name="number_of_rating"
                value={form.number_of_rating}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Ingredients (comma-separated)</label>
              <textarea
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Instructions</label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
              />
            </div>

            {/* <div className="form-group full">
              <label>Tags (comma-separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} />
            </div> */}
            <div className="form-group full">
              <label>Tags (drag or type)</label>
              <DroppableInput
                id="tags"
                value={form.tags}
                onChange={(val) => setForm({ ...form, tags: val })}
                onDrop={(val) => {
                  const current = form.tags.split(",").map((s) => s.trim());
                  if (!current.includes(val)) {
                    setForm({ ...form, tags: [...current, val].join(", ") });
                  }
                }}
              />
            </div>

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
                  />
                </div>
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={form.carbs}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Fat (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={form.fat}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={form.protein}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </fieldset>

            <div className="form-actions full">
              <button type="submit">Submit Recipe</button>
            </div>
          </div>
        </form>
      </div>
    </DndContext>
  );
}
