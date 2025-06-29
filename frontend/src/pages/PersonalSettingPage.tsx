import { useState } from "react";
import "../styles/personalSettingPage.css";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import savoureuxLogo from "../assets/otherImages/SavoureuxLogo.png";
import nextIcon from "../assets/iconImages/nextIcon.png";

const PersonalSettingPage = () => {
  const [userName, setUserName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { setUserId } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(""); // Xóa URL nếu chọn file
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null); // Xóa file nếu nhập URL
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || (!imageUrl && !imageFile)) {
      alert("Vui lòng nhập caption và chọn hình");
      return;
    }

    console.log("new user name:", userName);
    console.log("Image:", imageFile || imageUrl);
    setUserName("");
    setImageUrl("");
    setImageFile(null);
  };
  return (
    <div>
      <div className="body">
        <div id="setting-area">
          <img
            id="back-icon"
            src={nextIcon}
            alt=""
            onClick={() => {
              navigate("/");
            }}
          />
          <form className="upload-form" onSubmit={handleSubmit}>
            <img src={savoureuxLogo} alt="" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your new user name: "
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <input
              type="text"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://..."
            />

            <button className="sp-btn" type="submit">
              Submit
            </button>
          </form>
          <button
            id="logout-btn"
            className="sp-btn"
            onClick={() => {
              setUserId("");
              navigate("/log-in");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingPage;
