import "../styles/fonts.css";
import "../styles/profileSideBar.css";
import homeIcon from "../assets/iconImages/homeIcon.png";
import profileIcon from "../assets/iconImages/profileIcon.png";
import settingIcon from "../assets/iconImages/settingIcon.png";
import salad from "../assets/otherImages/salad.png";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

interface userProfileType {
  id: string;
  userName: string;
  email: string;
  avatar: string;
  preferences: {
    diet: string;
    allergies: string[];
  };
}

const ProfileSideBar = () => {
  const { userId } = useAuth();
  const [userProfile, setUserProfile] = useState<userProfileType | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch("http://127.0.0.1:5000/user/" + userId);
      const data = await response.json();
      setUserProfile(data);
    };
    fetchUserProfile();
  }, [userId]);

  return (
    <div id="profileSB_container">
      <div id="avatar_area">
        <img src={userProfile?.avatar} alt="" />
        <h5>{userProfile?.userName}</h5>
      </div>

      <div
        className="personal_setting_buttons"
        id="newfeed_area"
        onClick={() => navigate("/")}
      >
        <div className="icon_wrapper">
          <img src={homeIcon} alt="" />
        </div>
        <h6>My feed</h6>
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
