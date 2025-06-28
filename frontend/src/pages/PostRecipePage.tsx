import ProfileSideBar from "../components/ProfileSideBar";
import leave from "../assets/otherImages/leave.png";
import FormPostRecipe from "../components/FormPostRecipe";
import "../styles/postRecipePage.css";

const PostRecipePage = () => {
  return (
    <div className="body">
      <img id="leave_img" src={leave} alt="" />
      <div className="profile">
        <ProfileSideBar />
      </div>
      <div className="post-all-area">
        <FormPostRecipe />
      </div>
    </div>
  );
};

export default PostRecipePage;
