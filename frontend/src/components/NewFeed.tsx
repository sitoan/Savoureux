import "../styles/newFeed.css";
import "../styles/fonts.css";
import "../styles/MealPlanCalendar.css";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import nextIcon from "../assets/iconImages/nextIcon.png";
import { useNavigate } from "react-router-dom";

import RecipeCard from "./RecipeCard";
import WeeklyMealPlanCalendar from "./MealPlanCalendar";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext";

interface recipeInfo {
  id: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  posted_by: string;
}

interface userMealPlan {
  recipeId: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  posted_by: string;
}

const NewFeed = () => {
  const { userId } = useAuth();
  const recipeRef = useRef<HTMLDivElement>(null);

  const [recipeInfo, setRecipeInfo] = useState<recipeInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFavoriteRecipeResponse = await fetch(
          "http://127.0.0.1:5000/user/favorite/" + userId
        );
        const userFavoriteRecipeData = await userFavoriteRecipeResponse.json();
        setRecipeInfo(userFavoriteRecipeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

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
  };

  const handleClickCard = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div id="nf_container">
      <h2>
        Un monde de saveurs, une recette <br /> à la fois.
      </h2>

      {/* Weekly Meal Plan Calendar */}
      <WeeklyMealPlanCalendar />

      <div id="newFeed_header">
        <h3>For you</h3>
        <div
          id="view_all_area"
          onClick={() => {
            navigate("/view-all");
          }}
        >
          <h5>Discovery</h5>
          <img src={nextIcon} alt="" />
        </div>
      </div>
      <div className="content_wrapper" ref={recipeRef}>
        <div className="content_container">
          {recipeInfo.map((recipeInfo, id) => {
            return (
              <RecipeCard
                key={id}
                id={recipeInfo.id}
                title={recipeInfo.title}
                image={recipeInfo.image}
                description={recipeInfo.description}
                avg_rating={recipeInfo?.avg_rating || 0}
                onClick={() => handleClickCard(recipeInfo.id)}
                posted_by={recipeInfo.posted_by}
              />
            );
          })}
        </div>
      </div>

      {/* <div
        className="next-button-category"
        onClick={() => handleScroll(categoryRef)}
      >
        <img src={nextRightArrow} alt="" />
      </div> */}
      {/* <div
        className="next_button-recipe-card"
        onClick={() => handleScroll(recipeRef)}
      >
        <img src={nextRightArrow} alt="" />
      </div> */}
    </div>
  );
};

export default NewFeed;