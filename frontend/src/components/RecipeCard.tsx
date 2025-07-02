import "../styles/recipeCard.css";
import shareIcon from "../assets/iconImages/share.png";
import star from "../assets/iconImages/star.png";

interface CardInfor {
  id: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  posted_by: string;
  onClick?: () => void;
}
const RecipeCard = ({
  title,
  image,
  description,
  avg_rating,
  posted_by,
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
      </div>
      <p className="posted-by">Posted by: {posted_by}</p>
    </div>
  );
};
export default RecipeCard;
