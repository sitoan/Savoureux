import "../styles/newFeed.css";
import "../styles/fonts.css";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import nextIcon from "../assets/iconImages/nextIcon.png";
import { useNavigate } from "react-router-dom";
import Category from "./Category";
import RecipeCard from "./RecipeCard";
import { useRef } from "react";
import { useCategoryContext } from "../context/categoryContext";
import {
  useRecipeInfoContext,
  useRecipeRatingContext,
} from "../context/recipeContext";
import { useUserFavoriteAndRatingContext } from "../context/userContext";

const NewFeed = () => {
  const { categories } = useCategoryContext();
  const { userFavoriteAndRating } = useUserFavoriteAndRatingContext();
  const { recipeRatingMap } = useRecipeRatingContext();
  const { recipeInfoMap } = useRecipeInfoContext();

  const categoryRef = useRef<HTMLDivElement>(null);
  const recipeRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
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


    const handleClickCard = (id: string) => {
      navigate(`/recipe/${id}`);
    };

    return (
      <div id="nf_container">
        <h2>
          Un monde de saveurs, une recette <br /> à la fois.
        </h2>
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
          <div id="view_all_area">
            <h5>Discovery</h5>
            <img src={nextIcon} alt="" />
          </div>
        </div>
        <div className="content_wrapper" ref={recipeRef}>
          <div className="content_container">
            {userFavoriteAndRating?.favorites.map((id) => {
              const info = recipeInfoMap[id];
              const rating = recipeRatingMap[id];

              // Nếu recipe không tồn tại trong map thì bỏ qua
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
<<<<<<< HEAD

  const handleClickCard = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div id="nf_container">
      <h2>
        Un monde de saveurs, une recette <br /> à la fois.
      </h2>
      <h3>Categories</h3>
      <div className="categories_wrapper" ref={categoryRef}>
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
      <div className="content_wrapper" ref={recipeRef}>
        <div className="content_container">
          <RecipeCard
            id={sample.id}
            title={sample.title}
            image={sample.image}
            description={sample.description}
            avg_rating={sample.avg_rating}
            onClick={() => handleClickCard(sample.id)}
          />
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
=======
>>>>>>> 4749f79bd47054a4efa5246700e5a65758b9ae58
};
export default NewFeed;
