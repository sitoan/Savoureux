import "../styles/newFeed.css";
import "../styles/fonts.css";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type Key } from "react";

import Category from "./Category";
import RecipeCard from "./RecipeCard";
import Dropdown from "./Dropdown";
import { useAuth } from "../context/authContext";

interface CategoryType {
  title: string;
  image: string;
}

interface RecipeInfo {
  id: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  posted_by: string;
}

interface SortOption {
  sortType: string;
  dimension: string | null;
}

const ViewAllDetail = () => {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipeList, setRecipeList] = useState<RecipeInfo[]>([]);
  const [filteredRecipeList, setFilteredRecipeList] = useState<RecipeInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>({
    sortType: "All Recipe",
    dimension: null,
  });

  const { userId } = useAuth();
  const navigate = useNavigate();

  const categoryRef = useRef<HTMLDivElement>(null);
  const recipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/category/all");
        const data = await res.json();
        setCategoryList(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      let url = "";
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (selectedCategory) {
        url = "http://127.0.0.1:5000/recipe/filter/category";
        headers["category"] = selectedCategory;
      } else {
        switch (sortOption.sortType) {
          case "A - Z":
            url = "http://127.0.0.1:5000/recipe/sort/name";
            headers["dimension"] = "ascending";
            break;
          case "Z - A":
            url = "http://127.0.0.1:5000/recipe/sort/name";
            headers["dimension"] = "descending";
            break;
          case "Rating Low to High":
            url = "http://127.0.0.1:5000/recipe/sort/rating";
            headers["dimension"] = "ascending";
            break;
          case "Rating High to Low":
            url = "http://127.0.0.1:5000/recipe/sort/rating";
            headers["dimension"] = "descending";
            break;
          default:
            url = "http://127.0.0.1:5000/recipe/all";
        }
      }

      try {
        const res = await fetch(url, { method: "GET", headers });
        const data = await res.json();
        setRecipeList(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchData();
  }, [sortOption, selectedCategory]);

  // Effect riêng để filter recipes theo search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = recipeList.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipeList(filtered);
    } else {
      setFilteredRecipeList(recipeList);
    }
  }, [recipeList, searchQuery]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    const container = ref.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 20;
      container.scrollTo({
        left: isAtEnd ? 0 : scrollLeft + 200,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (title: string) => {
    setSelectedCategory(title);
    setSortOption({ sortType: "All Recipe", dimension: null });
    setSearchQuery(""); // Reset search khi chọn category
    console.log("Selected category:", selectedCategory);
  };

  const handleCardClick = (id: string) => navigate(`/recipe/${id}`);

  const handleSortSelect = (option: SortOption) => {
    setSortOption(option);
    setSelectedCategory(null);
    setSearchQuery(""); // Reset search khi sort
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Reset category khi search (không cần reset sort vì search sẽ filter kết quả hiện tại)
    if (value.trim()) {
      setSelectedCategory(null);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  return (
    <div id="nf_container">
      <div className="header_section">
        <h2>View all Page</h2>
        <div className="search_container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search_input"
          />
          {searchQuery && (
            <button
              onClick={handleSearchClear}
              className="search_clear_btn"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <h3>Categories</h3>
      <div className="categories_wrapper" ref={categoryRef}>
        <div
          className="categories_container"
          onClick={() => console.log("clicked")}
        >
          {categoryList.map((item, index: Key) => (
            <Category
              key={index}
              image={item.image}
              title={item.title}
              onSelect={() => handleCategoryClick(item.title)}
            />
          ))}
        </div>
      </div>

      <div id="newFeed_header">
        <h3>All Recipes</h3>
        <Dropdown onSelect={handleSortSelect} />
      </div>

      <div className="content_wrapper" ref={recipeRef}>
        <div className="content_container">
          {filteredRecipeList.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              avg_rating={recipe.avg_rating || 0}
              onClick={() => handleCardClick(recipe.id)} posted_by={recipe.posted_by}            />
          ))}
        </div>
      </div>

      {/* <div
        className="next-button-category"
        onClick={() => handleScroll(categoryRef)}
      >
        <img src={nextRightArrow} alt="scroll category" />
      </div>

      <div
        className="next_button-recipe-card"
        onClick={() => handleScroll(recipeRef)}
      >
        <img src={nextRightArrow} alt="scroll recipe" />
      </div> */}
    </div>
  );
};

export default ViewAllDetail;