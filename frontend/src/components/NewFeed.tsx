import "../styles/newFeed.css";
import "../styles/fonts.css";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import nextIcon from "../assets/iconImages/nextIcon.png";

import Category from "./Category";
import RecipeCard from "./RecipeCard";
import { useRef } from "react";
import { useCategoryContext } from "../context/categoryContext";
import {
  useRecipeInfoContext,
  useRecipeRatingContext,
} from "../context/recipeContext";


const NewFeed = () => {
  const { categories } = useCategoryContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { recipeRatingMap } = useRecipeRatingContext();
  const { recipeInfoMap } = useRecipeInfoContext();
  const handleNextClick = () => {
    const container = scrollRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 20; // 20 để trừ hao

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 200, behavior: "smooth" });
      }
    }
  };
  const handleClickCard = (id: string) => {
    console.log(id);
  };

  return (
    <div id="nf_container">
      <h2>
        Un monde de saveurs, une recette <br /> à la fois.
      </h2>
      <h3>Categories</h3>
      <div className="categories_wrapper" ref={scrollRef}>
        <div className="categories_container">
          {categories.map((item, index) => (
            <Category key={index} image={item.image} title={item.title} />
          ))}
        </div>
      </div>
      <div id="newFeed_header">
        <h3>All items</h3>
        <div id="view_all_area">
          <h5>View all</h5>
          <img src={nextIcon} alt="" />
        </div>
      </div>
      <div className="content_wrapper" ref={scrollRef}>
        <div className="content_container">
          {Object.entries(recipeInfoMap).map(([id, info]) => {
            const rating = recipeRatingMap[id];
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
      <div className="next-button-category" onClick={handleNextClick}>
        <img src={nextRightArrow} alt="" />
      </div>
      <div className="next_button-recipe-card" onClick={handleNextClick}>
        <img src={nextRightArrow} alt="" />
      </div>
    </div>
  );
};

export default NewFeed;
