import { useState } from "react";
import "../styles/LoginPage.css";
import savoureuxLogo from "../assets/otherImages/SavoureuxLogo.png";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setUserId } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "", general: "" });
    }
  };

  // Improved validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "Email is required";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
      general: ""
    });

    return !emailError && !passwordError;
  };

  const fetchLoginData = async (email: string, password: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data) {
        throw new Error("Email or password is incorrect");
      }
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("User not found");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const user_data = await fetchLoginData(formData.email, formData.password);
      
      if (user_data.user_id) {
        setUserId(user_data.user_id);
        alert(`Welcome back ${user_data.username}!`);
        navigate("/");
      } else {
        setErrors({
          ...errors,
          general: "Email or password is incorrect"
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setIsLoading(false);
    }
    
    // Clear form after submission attempt
    setFormData({ email: "", password: "" });
  };

  return (
    <div id="log-in-container">
      <img src={savoureuxLogo} alt="Savoureux Logo" />
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {errors.general && (
          <div className="general-error">
            {errors.general}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;