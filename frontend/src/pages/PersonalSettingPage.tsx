import "../styles/personalSettingPage.css";
import ProfileSideBar from "../components/ProfileSideBar";
import leave from "../assets/otherImages/leave.png";
import ProfileSetting from "../components/ProfileSetting";
const PersonalSettingPage = () => {
  return (
    <div className="body">
      <img id="leave_img" src={leave} alt="" />
      <div className="profile">
        <ProfileSideBar />
      </div>
      <div className="newFeedArea">
        <ProfileSetting />
      </div>
    </div>
  );
};

export default PersonalSettingPage;
