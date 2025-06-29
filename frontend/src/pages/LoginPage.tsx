import { useState } from "react";
import "../styles/LoginPage.css";
import savoureuxLogo from "../assets/otherImages/SavoureuxLogo.png";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { setUserId } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username === "demo" && formData.password === "demo") {
      console.log("Correct Password:", formData);
      setUserId("f50967e4-24af-439a-83de-f4b411001c0c");
      navigate("/");
    } else {
      alert("Incorrect password");
    }
    setFormData({ username: "", password: "" });
  };
  return (
    <div id="log-in-container">
      <img src={savoureuxLogo} alt="" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
