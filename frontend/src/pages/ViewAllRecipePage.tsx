import "../styles/fonts.css";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";
import Category from "../components/Category";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useRef, useState } from "react";
import { useCategoryContext } from "../context/categoryContext";
import "../styles/allRecipeContainer.css";

import {
  useRecipeInfoContext,
  useRecipeRatingContext,
} from "../context/recipeContext";
import { useUserFavoriteAndRatingContext } from "../context/userContext";

const AllRecipeContainer = () => {
  const { categories } = useCategoryContext();
  const { userFavoriteAndRating } = useUserFavoriteAndRatingContext();
  const { recipeRatingMap } = useRecipeRatingContext();
  const { recipeInfoMap } = useRecipeInfoContext();

  const categoryRef = useRef<HTMLDivElement>(null);
  const recipeRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const [filter, setFilter] = useState("All Recipe");
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    const container = ref.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 20;

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 200, behavior: "smooth" });
      }
    }
  };
  const handleClickCard = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  useEffect(() => {
    console.log(filter);
  }, [filter]);

  return (
    <div id="view-all-container">
      <h2>VIEW ALL PAGE</h2>
      <h3>Categories</h3>
      <div className="categories_wrapper" ref={categoryRef}>
        <div className="categories_container">
          {categories.map((item, index) => (
            <Category key={index} image={item.image} title={item.title} />
          ))}
        </div>
      </div>

      <div id="newFeed_header">
        <h3>For you</h3>
        <div className="filter-dropdown">
          <Dropdown onSelect={handleFilterChange} defaultValue={filter} />
        </div>
      </div>
      <div className="content_wrapper" ref={recipeRef}>
        <div className="content_container">
          {userFavoriteAndRating?.favorites.map((id) => {
            const info = recipeInfoMap[id];
            const rating = recipeRatingMap[id];

            if (!info) return null;

            return (
              <RecipeCard
                key={id}
                id={id}
                title={info.title}
                image={info.image}
                description={info.description}
                avg_rating={rating?.avgRating || 0}
                onClick={() => handleClickCard(id)}
              />
            );
          })}
        </div>
      </div>

      <div
        className="next-button-category"
        onClick={() => handleScroll(categoryRef)}
      >
        <img src={nextRightArrow} alt="" />
      </div>
      <div
        className="next_button-recipe-card"
        onClick={() => handleScroll(recipeRef)}
      >
        <img src={nextRightArrow} alt="" />
      </div>
    </div>
  );
};

export default AllRecipeContainer;
