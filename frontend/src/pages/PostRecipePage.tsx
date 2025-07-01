// pages/PostRecipePage.tsx
import ProfileSideBar from "../components/ProfileSideBar";
import leave from "../assets/otherImages/leave.png";
import FormPostRecipe from "../components/FormPostRecipe";
import RecipeList from "../components/RecipeList";
import { RecipeProvider } from "../context/crudContext";
import "../styles/postRecipePage.css";

const PostRecipePage = () => {
  return (
    <RecipeProvider>
      <div className="body">
        <img id="leave_img" src={leave} alt="" />
        <div className="profile">
          <ProfileSideBar />
        </div>
        <div className="post-all-area">
          <div className="form-container-with-tags">
            <FormPostRecipe />
            <RecipeList />
          </div>
        </div>
      </div>
    </RecipeProvider>
  );
};

export default PostRecipePage;