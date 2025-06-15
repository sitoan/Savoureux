import "../styles/homePage.css";
import ProfileSideBar from "../components/ProfileSideBar";
import NewFeedContainer from "../components/NewFeedContainer";
import leave from "../assets/otherImages/leave.png";
const HomePage = () => {
  return (
    <div className="body">
      <img id="leave_img" src={leave} alt="" />
      <div className="profile">
        <ProfileSideBar />
      </div>
      <div className="newFeedArea">
        <NewFeedContainer />
      </div>
    </div>
  );
};

export default HomePage;
