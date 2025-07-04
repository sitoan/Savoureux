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
  username: string;
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
        <h5>{userProfile?.username}</h5>
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
      <div
        className="personal_setting_buttons"
        id="personal_area"
        onClick={() => navigate("/post-recipe")}
      >
        <div className="icon_wrapper">
          <img src={settingIcon} alt="" />
        </div>
        <h6>Recipe Setting</h6>
      </div>
      <div
        className="personal_setting_buttons"
        id="setting_area"
        onClick={() => {
          navigate("/personal-setting");
        }}
      >
        <div className="icon_wrapper">
          <img src={profileIcon} alt="" />
        </div>
        <h6>Profile setting</h6>
      </div>
      <div className="banner_wrapper">
        
        
      </div>
    </div>
  );
};

export default ProfileSideBar;
