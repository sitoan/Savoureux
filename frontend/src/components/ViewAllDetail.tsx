import "../styles/newFeed.css";
import "../styles/fonts.css";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import { useNavigate } from "react-router-dom";
import Category from "./Category";
import RecipeCard from "./RecipeCard";
import { useEffect, useRef, useState } from "react";

interface categoryType {
  title: string;
  image: string;
}

interface recipeInfo {
  id: string;
  title: string;
  image: string;
  description: string;
  avgRating: number;
}

import Dropdown from "./Dropdown";
import { useAuth } from "../context/authContext";
const ViewAllDetail = () => {
  const [filter, setFilter] = useState("All Recipe");
  const { userId } = useAuth();
  const categoryRef = useRef<HTMLDivElement>(null);
  const recipeRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<categoryType[]>([]);
  const [recipeInfo, setRecipeInfo] = useState<recipeInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(
          "http://127.0.0.1:5000/category/all"
        );
        const allRecipeResponse = await fetch(
          "http://127.0.0.1:5000/recipe/all"
        );
        const allRecipeData = await allRecipeResponse.json();
        setRecipeInfo(allRecipeData);
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const navigate = useNavigate();
  const handleSelect = (value: string) => {
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
    <div id="nf_container">
      <h2>View all Page</h2>
      <h3>Categories</h3>
      <div className="categories_wrapper" ref={categoryRef}>
        <div className="categories_container">
          {category.map((item, index) => (
            <Category key={index} image={item.image} title={item.title} />
          ))}
        </div>
      </div>

      <div id="newFeed_header">
        <h3>All Recipes</h3>
        <Dropdown onSelect={handleSelect} />
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
                avg_rating={recipeInfo?.avgRating || 0}
                onClick={() => handleClickCard(recipeInfo.id)}
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

export default ViewAllDetail;
