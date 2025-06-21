import ProfileSideBar from "../components/ProfileSideBar";
import leave from "../assets/otherImages/leave.png";
import RecipeDetail from "../components/RecipeDetail";
import "../styles/recipePage.css";

const RecipePage = () => {
  return (
    <div className="body">
      <img id="leave_img" src={leave} alt="" />
      <div className="profile">
        <ProfileSideBar />
      </div>
      <div className="recipeArea">
        <RecipeDetail />
      </div>
    </div>
  );
};

export default RecipePage;
