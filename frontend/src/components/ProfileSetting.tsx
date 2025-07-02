import { useState, useEffect } from "react";
import "../styles/personalSettingComponent.css";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import savoureuxLogo from "../assets/otherImages/SavoureuxLogo.png";
import nextIcon from "../assets/iconImages/nextIcon.png";

interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  preferences: {
    diet: string;
    allergies: string[];
  };
}

interface UserActivity {
  number_of_recipes_created: number;
  number_of_recipes_commented: number;
  number_of_recipes_rated: number;
  recipes: RecipeInfoType[];
}

interface RecipeInfoType {
  id: string;
  title: string;
  description: string;
  image: string;
  posted_by: string;
}

const PersonalSettingPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");

  const { userId, setUserId } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/user/${userId}/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data: UserProfile = await response.json();
      setUserProfile(data);
      console.log("user profile:", userProfile);

      // Initialize form states
      setUserName(data.username);
      setEmail(data.email);
      setImageUrl(data.avatar);
      setDiet(data.preferences.diet);
      setAllergies(data.preferences.allergies);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load user profile");
    }
  };

  // Fetch user activity
  const fetchUserActivity = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/user/${userId}/activity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user activity");
      }

      const data: UserActivity = await response.json();
      setUserActivity(data);
      console.log("user activity:", data);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      setError("Failed to load user activity");
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        navigate("/log-in");
        return;
      }

      setLoading(true);
      await Promise.all([fetchUserProfile(), fetchUserActivity()]);
      setLoading(false);
    };

    loadData();
  }, [userId, navigate]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setImageUrl(url);
    }
  };

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  // Add allergy
  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  // Remove allergy
  const handleRemoveAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter((a) => a !== allergyToRemove));
  };

  // Save profile changes
  const handleSubmit = async () => {
    try {
      let mappedData: UserProfile = {
        username: userName,
        email: email,
        avatar: imageUrl,
        preferences: {
          diet: diet,
          allergies: allergies,
        },
      };

      const response = await fetch(
        `http://127.0.0.1:5000/user/${userId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Refresh profile data
      await fetchUserProfile();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserId("");
    navigate("/log-in");
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const dietOptions = [
    "None",
    "Vegetarian",
    "Vegan",
    "Keto",
    "Paleo",
    "Mediterranean",
  ];

  return (
    <div className="personal-settings-page">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <button className="back-btn" onClick={handleBack}>
            <img src={nextIcon} alt="Back" className="back-icon" />
            <span>Back</span>
          </button>

          <div className="logo-container">
            <img src={savoureuxLogo} alt="Savoureux" className="logo" />
          </div>

          <div className="header-spacer"></div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-grid">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Profile Settings</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`edit-btn ${isEditing ? "editing" : ""}`}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="profile-form">
              {/* Profile Image */}
              <div className="profile-image-section">
                <div className="profile-image-container">
                  <img
                    src={imageUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="profile-image"
                  />
                  {isEditing && (
                    <label className="image-upload-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <span className="upload-icon">📷</span>
                    </label>
                  )}
                </div>
                {isEditing && (
                  <div className="image-url-input">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      placeholder="Or enter image URL"
                      className="url-input"
                    />
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              {/* Diet Preference */}
              <div className="form-group">
                <label className="form-label">Diet Preference</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  disabled={!isEditing}
                  className="form-select"
                >
                  {dietOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Allergies */}
              <div className="form-group">
                <label className="form-label">Allergies</label>
                <div className="allergies-container">
                  {allergies.map((allergy) => (
                    <span key={allergy} className="allergy-tag">
                      {allergy}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(allergy)}
                          className="remove-allergy-btn"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="add-allergy-container">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add new allergy"
                      className="allergy-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      className="add-allergy-btn"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="form-actions">
                  <button onClick={handleSubmit} className="save-btn">
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="logout-section">
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>

          {/* Activity Section */}
          <div className="activity-section">
            <h2>Activity Overview</h2>

            {userActivity && (
              <>
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card recipes-created">
                    <div className="stat-icon">👨‍🍳</div>
                    <div className="stat-number">
                      {userActivity.number_of_recipes_created}
                    </div>
                    <div className="stat-label">Recipes Created</div>
                  </div>

                  <div className="stat-card comments">
                    <div className="stat-icon">💬</div>
                    <div className="stat-number">
                      {userActivity.number_of_recipes_commented}
                    </div>
                    <div className="stat-label">Comments</div>
                  </div>

                  <div className="stat-card ratings">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-number">
                      {userActivity.number_of_recipes_rated}
                    </div>
                    <div className="stat-label">Ratings Given</div>
                  </div>
                </div>

                {/* Recent Recipes */}
                <div className="recent-recipes">
                  <h3>Your Recent Recipes</h3>
                  {userActivity.recipes.length > 0 ? (
                    <div className="recipes-list">
                      {userActivity.recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-item">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="recipe-image"
                          />
                          <div className="recipe-content">
                            <h4 className="recipe-title">{recipe.title}</h4>
                            <p className="recipe-description">
                              {recipe.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-recipes">
                      <div className="no-recipes-icon">👨‍🍳</div>
                      <p>No recipes created yet</p>
                      <small>Start sharing your culinary creations!</small>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingPage;


