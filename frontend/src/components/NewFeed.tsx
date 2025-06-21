import "../styles/newFeed.css";
import "../styles/fonts.css";
import vietnamese from "../assets/categoryImages/vietnamese.png";
import chinese from "../assets/categoryImages/chinese.png";
import italian from "../assets/categoryImages/italian.png";
import usuk from "../assets/categoryImages/usuk.png";
import sweet from "../assets/categoryImages/sweet.png";
import drink from "../assets/categoryImages/drink.png";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import nextIcon from "../assets/iconImages/nextIcon.png";
import rissotoImage from "../assets/foodImages/risotto.png";
import { useNavigate } from "react-router-dom";
import Category from "./Category";
import RecipeCard from "./RecipeCard";
import { useRef } from "react";
interface CardInfor {
  id: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  onClick?: () => void;
}

const sample: CardInfor = {
  id: "5a902bbf-5b69-4fd5-a4bb-efb4c973a25f",
  title: "Mushroom Risotto",
  image: rissotoImage,
  description: "Creamy Italian rice dish with mixed mushrooms",
  avg_rating: 4,
};

const NewFeed = () => {
  const categories = [
    { src: vietnamese, title: "Vietnamese" },
    { src: italian, title: "Italian" },
    { src: chinese, title: "Chinese" },
    { src: usuk, title: "USUK" },
    { src: sweet, title: "Sweet" },
    { src: drink, title: "Drink" },
    { src: drink, title: "Drink" },
    { src: drink, title: "Drink" },
    { src: drink, title: "Drink" },
  ];
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
  };

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
            <Category key={index} image={item.src} title={item.title} />
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
          <RecipeCard
            id={sample.id}
            title={sample.title}
            image={sample.image}
            description={sample.description}
            avg_rating={sample.avg_rating}
            onClick={() => handleClickCard(sample.id)}
          />
          <RecipeCard
            id={sample.id}
            title={sample.title}
            image={sample.image}
            description={sample.description}
            avg_rating={sample.avg_rating}
            onClick={() => handleClickCard(sample.id)}
          />
          <RecipeCard
            id={sample.id}
            title={sample.title}
            image={sample.image}
            description={sample.description}
            avg_rating={sample.avg_rating}
            onClick={() => handleClickCard(sample.id)}
          />
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
};

export default NewFeed;
