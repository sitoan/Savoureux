import "../styles/NewFeed.css";
import "../styles/fonts.css";
import vietnamese from "../assets/categoryImages/vietnamese.png";
import chinese from "../assets/categoryImages/chinese.png";
import italian from "../assets/categoryImages/italian.png";
import usuk from "../assets/categoryImages/usuk.png";
import sweet from "../assets/categoryImages/sweet.png";
import drink from "../assets/categoryImages/drink.png";
import nextRightArrow from "../assets/iconImages/nextrightArrow.png";
import nextIcon from "../assets/iconImages/nextIcon.png";
import Category from "./Category";
import { useRef } from "react";

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
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleNextClick = () => {
    const container = categoriesRef.current;
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

  return (
    <div id="nf_container">
      <h2>
        Un monde de saveurs, une recette <br /> à la fois.
      </h2>
      <h3>Categories</h3>
      <div className="categories_wrapper" ref={categoriesRef}>
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
      <div id="content"></div>
      <div className="next_button" onClick={handleNextClick}>
        <img src={nextRightArrow} alt="" />
      </div>
    </div>
  );
};

export default NewFeed;
