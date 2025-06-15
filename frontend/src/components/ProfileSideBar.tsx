import "../styles/fonts.css";
import "../styles/profileSideBar.css";
import homeIcon from "../assets/iconImages/homeIcon.png";
import profileIcon from "../assets/iconImages/profileIcon.png";
import settingIcon from "../assets/iconImages/settingIcon.png";
import avatar_sample from "../assets/otherImages/avatar_sample.jpg";
import salad from "../assets/otherImages/salad.png";
const ProfileSideBar = () => {
  return (
    <div id="profileSB_container">
      <div id="avatar_area">
        <img src={avatar_sample} alt="" />
        <h5>@chefJasper_P</h5>
      </div>

      <div className="personal_setting_buttons" id="newfeed_area">
        <div className="icon_wrapper">
          <img src={homeIcon} alt="" />
        </div>
        <h6>New feed</h6>
      </div>
      <div className="personal_setting_buttons" id="personal_area">
        <div className="icon_wrapper">
          <img src={profileIcon} alt="" />
        </div>
        <h6>Personal recipe</h6>
      </div>
      <div className="personal_setting_buttons" id="setting_area">
        <div className="icon_wrapper">
          <img src={settingIcon} alt="" />
        </div>
        <h6>Settings</h6>
      </div>
      <div className="banner_wrapper">
        <img id="profile_banner_img" src={salad} alt="" />
        <svg
          className="s-top-wave"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C480,100 960,20 1440,60 L1440,0 L0,0 Z"
            fill="aliceblue"
          />
        </svg>
        <h4>
          Make your
          <br /> own recipe !
        </h4>
      </div>
    </div>
  );
};

export default ProfileSideBar;
