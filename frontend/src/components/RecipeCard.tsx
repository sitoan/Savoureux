import "../styles/recipeCard.css";
import shareIcon from "../assets/iconImages/share.png";
import star from "../assets/iconImages/star.png";

interface CardInfor {
  id: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  onClick?: () => void;
}
const RecipeCard = ({
  title,
  image,
  description,
  avg_rating,
  onClick,
}: CardInfor) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={image} alt={title} />
      <h5>{title}</h5>
      <div className="recipe-card-description">
        <p>{description}</p>
      </div>
      <div className="recipe-card-footer">
        <div className="rating">
          <p>{avg_rating}</p>
          <img src={star} alt="" />
        </div>
        <div className="share-button-area">
          <button>
            <img src={shareIcon} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default RecipeCard;
