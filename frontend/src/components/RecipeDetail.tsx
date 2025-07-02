import { useParams } from "react-router-dom";
import "../styles/recipeDetail.css";
import { useEffect, useState } from "react";
import shareIcon from "../assets/iconImages/share.png";
import { useAuth } from "../context/authContext";

export interface recipeDataType {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  servings: number;
  category: string[];
  totalScore: number;
  numberOfRating: number;
  avgRating: number;
  nutritionalInfo: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  comments: {
    text: string;
    userName: string;
    timestamp: string;
  }[];
  tags: string[];
  shareUrl: string;
}

interface MealPlanData {
  date: string;
  mealType: string;
}

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState<recipeDataType>({
    id: "",
    title: "",
    description: "",
    image: "",
    ingredients: [],
    instructions: "",
    cookingTime: 0,
    servings: 0,
    category: [],
    totalScore: 0,
    numberOfRating: 0,
    avgRating: 0,
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    },
    comments: [],
    tags: [],
    shareUrl: "",
  });

  // States cho comment và rating
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho favorite toggle
  const [isFavorite, setIsFavorite] = useState(false);
  
  // States cho meal plan form
  const [showMealPlanForm, setShowMealPlanForm] = useState(false);
  const [mealPlanData, setMealPlanData] = useState<MealPlanData>({
    date: new Date().toISOString().split('T')[0], // Today's date as default
    mealType: "breakfast"
  });
  const [isAddingToMealPlan, setIsAddingToMealPlan] = useState(false);

  const { userId } = useAuth();

  // Fetch data
  useEffect(() => {
    if (!id) return;
    const fetchRecipeData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/recipe/" + id);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const mappedData: recipeDataType = {
          id: data.id,
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          ingredients: data.ingredients || [],
          instructions: data.instructions || "",
          cookingTime: data.cooking_time || 0,
          servings: data.servings || 0,
          category: data.category || [],
          totalScore: data.total_score || 0,
          numberOfRating: data.number_of_rating || 0,
          avgRating: data.avg_rating || 0,
          nutritionalInfo: {
            calories: data.nutritional_info?.calories || 0,
            protein: data.nutritional_info?.protein || 0,
            fat: data.nutritional_info?.fat || 0,
            carbs: data.nutritional_info?.carbs || 0,
          },
          comments: data.comments || [],
          tags: data.tags || [],
          shareUrl: data.share_url || "",
        };
        setRecipeData(mappedData);
        const is_favorite = await fetch(
          `http://127.0.0.1:5000/user/${userId}/favorite/${id}`
        );
        const isFavoriteData = await is_favorite.json();
        console.log(isFavoriteData);
        setIsFavorite(isFavoriteData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchRecipeData();
  }, [id, userId]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Nếu đang là favorite, thì remove
        const result = await removeFavorite(recipeData.id);
        // Chỉ cần check response thành công (status 200-299)
        setIsFavorite(false);
      } else {
        // Nếu chưa là favorite, thì add
        const result = await setFavorite(recipeData.id);
        // Chỉ cần check response thành công (status 200-299)  
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Có thể hiển thị thông báo lỗi cho user
      alert('Có lỗi xảy ra khi cập nhật yêu thích. Vui lòng thử lại!');
    }
  };

  // Cải thiện hàm setFavorite
  const setFavorite = async (recipeId: string) => {
    try {
      const favoriteResponse = await fetch(`http://127.0.0.1:5000/user/${userId}/favorite/${recipeId}/add`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!favoriteResponse.ok) {
        throw new Error('Failed to add favorite');
      }
      
      // Kiểm tra content-type để xử lý response phù hợp
      const contentType = favoriteResponse.headers.get('content-type');
      let favoriteData;
      
      if (contentType && contentType.includes('application/json')) {
        favoriteData = await favoriteResponse.json();
      } else {
        // Nếu response là text, tạo object success
        const textResponse = await favoriteResponse.text();
        favoriteData = { success: true, message: textResponse };
      }
      
      return favoriteData;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  // Cải thiện hàm removeFavorite
  const removeFavorite = async (recipeId: string) => {
    try {
      const favoriteResponse = await fetch(`http://127.0.0.1:5000/user/${userId}/favorite/${recipeId}/remove`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!favoriteResponse.ok) {
        throw new Error('Failed to remove favorite');
      }
      
      // Kiểm tra content-type để xử lý response phù hợp
      const contentType = favoriteResponse.headers.get('content-type');
      let favoriteData;
      
      if (contentType && contentType.includes('application/json')) {
        favoriteData = await favoriteResponse.json();
      } else {
        // Nếu response là text, tạo object success
        const textResponse = await favoriteResponse.text();
        favoriteData = { success: true, message: textResponse };
      }
      
      return favoriteData;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  // Handle meal plan form toggle
  const handleToggleMealPlanForm = () => {
    setShowMealPlanForm(!showMealPlanForm);
    if (!showMealPlanForm) {
      // Reset form data when opening
      setMealPlanData({
        date: new Date().toISOString().split('T')[0],
        mealType: "breakfast"
      });
    }
  };

  // Handle add to meal plan
  const handleAddToMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingToMealPlan(true);

    try {
      const mealPlanPayload = {
        date: mealPlanData.date,
        meals: [
          {
            type: mealPlanData.mealType,
            recipe_id: recipeData.id
          }
        ]
      };

      const response = await fetch(`http://127.0.0.1:5000/user/${userId}/meal_plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealPlanPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to add to meal plan');
      }

      // Success
      alert('Added to meal plan successfully!');
      setShowMealPlanForm(false);
    } catch (error) {
      console.error('Error adding to meal plan:', error);
      alert('Failed to add to meal plan. Please try again.');
    } finally {
      setIsAddingToMealPlan(false);
    }
  };

  // Handle share function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeData.title,
          text: recipeData.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link đã được sao chép vào clipboard!");
    }
  };

  // Submit comment và rating
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !newComment.trim() || userRating === 0) {
      alert("Vui lòng điền đầy đủ thông tin và chọn rating!");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        user_id: userId,
        userName: userName.trim(),
        comment: newComment.trim(),
        rating: userRating,
      };
      const response = await fetch(
        `http://127.0.0.1:5000/recipe/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      // Reset form
      setNewComment("");
      setUserName("");
      setUserRating(0);
      setHoveredRating(0);

      // Refresh recipe data để lấy comment mới
      const updatedResponse = await fetch("http://127.0.0.1:5000/recipe/" + id);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        const mappedData: recipeDataType = {
          id: updatedData.id,
          title: updatedData.title || "",
          description: updatedData.description || "",
          image: updatedData.image || "",
          ingredients: updatedData.ingredients || [],
          instructions: updatedData.instructions || "",
          cookingTime: updatedData.cooking_time || 0,
          servings: updatedData.servings || 0,
          category: updatedData.category || [],
          totalScore: updatedData.total_score || 0,
          numberOfRating: updatedData.number_of_rating || 0,
          avgRating: updatedData.avg_rating || 0,
          nutritionalInfo: {
            calories: updatedData.nutritional_info?.calories || 0,
            protein: updatedData.nutritional_info?.protein || 0,
            fat: updatedData.nutritional_info?.fat || 0,
            carbs: updatedData.nutritional_info?.carbs || 0,
          },
          comments: updatedData.comments || [],
          tags: updatedData.tags || [],
          shareUrl: updatedData.share_url || "",
        };
        setRecipeData(mappedData);
      }

      alert("Đánh giá của bạn đã được gửi thành công!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating
  const renderStarRating = (rating: number, interactive: boolean = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${interactive ? "interactive" : ""} ${
            i <= (interactive ? hoveredRating || userRating : rating)
              ? "filled"
              : ""
          }`}
          onClick={interactive ? () => setUserRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{recipeData?.title || "Loading..."}</h1>

      {recipeData.image && (
        <img
          className="recipe-image"
          src={recipeData.image}
          alt={recipeData.title}
        />
      )}

      <p className="recipe-description">{recipeData?.description}</p>

      <div className="recipe-meta">
        <span>
          {renderStarRating(Math.round(recipeData.avgRating))}{" "}
          {recipeData.avgRating.toFixed(1)} ({recipeData.numberOfRating} đánh
          giá)
        </span>
        <span>⏱ {recipeData.cookingTime} mins</span>
        <span>🍽 {recipeData.servings} servings</span>

        {/* Action buttons area */}
        <div className="action-buttons-area">
          {/* Meal Plan button */}
          <button
            className="meal-plan-button"
            onClick={handleToggleMealPlanForm}
            title="Thêm vào kế hoạch ăn uống"
          >
            <svg
              className="calendar-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </button>

          {/* Favorite toggle button */}
          <button
            className={`favorite-button ${isFavorite ? "active" : ""}`}
            onClick={handleToggleFavorite}
            title={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <svg
              className="heart-icon"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Share button */}
          <button
            className="share-button"
            onClick={handleShare}
            title="Chia sẻ công thức"
          >
            <img src={shareIcon} alt="Share" />
          </button>
        </div>
      </div>

      {/* Meal Plan Form */}
      {showMealPlanForm && (
        <div className="recipe-section">
          <h3>Thêm vào kế hoạch ăn uống</h3>
          <form onSubmit={handleAddToMealPlan} className="meal-plan-form">
            <div className="form-group">
              <label htmlFor="meal-date">Ngày:</label>
              <input
                type="date"
                id="meal-date"
                value={mealPlanData.date}
                onChange={(e) => setMealPlanData({
                  ...mealPlanData,
                  date: e.target.value
                })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="meal-type">Bữa ăn:</label>
              <select
                id="meal-type"
                value={mealPlanData.mealType}
                onChange={(e) => setMealPlanData({
                  ...mealPlanData,
                  mealType: e.target.value
                })}
                required
              >
                <option value="breakfast">Sáng</option>
                <option value="lunch">Trưa</option>
                <option value="dinner">Tối</option>
              </select>
            </div>

            <div className="form-buttons">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowMealPlanForm(false)}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="add-meal-plan-btn"
                disabled={isAddingToMealPlan}
              >
                {isAddingToMealPlan ? "Đang thêm..." : "Thêm vào kế hoạch"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="instruction-section">
        <h3>Instruction</h3>
        <p className="instruction">{recipeData.instructions}</p>
      </div>

      <div className="recipe-section">
        <h3>Category</h3>
        <ul className="chip-list">
          {recipeData.category?.map((item: string, i: number) => (
            <li className="chip" key={i}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Tags</h3>
        <ul className="chip-list">
          {recipeData.tags?.map((tag: string, i: number) => (
            <li className="chip" key={i}>
              #{tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Ingredients</h3>
        {recipeData?.ingredients?.length > 0 ? (
          <ul className="ingredient-list">
            {recipeData.ingredients?.map((ingredient: string, i: number) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p>No ingredients yet.</p>
        )}
      </div>

      {/* Form thêm đánh giá */}
      <div className="recipe-section">
        <h3>Thêm đánh giá của bạn</h3>
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label htmlFor="userName">Tên của bạn:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tên của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label>Đánh giá:</label>
            <div className="rating-input">
              {renderStarRating(userRating, true)}
              <span className="rating-text">
                {userRating > 0 ? `${userRating}/5 sao` : "Chọn rating"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Bình luận:</label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về công thức này..."
              rows={4}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      </div>

      {/* Hiển thị comments */}
      <div className="recipe-section">
        <h3>Đánh giá và bình luận ({recipeData.comments?.length || 0})</h3>
        {recipeData.comments?.length === 0 ? (
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        ) : (
          <ul className="comment-list">
            {recipeData.comments?.map((comment: any, i: number) => (
              <li key={i} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.username || comment.userName}</strong>
                  {comment.rating && (
                    <div className="comment-rating">
                      {renderStarRating(comment.rating)}
                    </div>
                  )}
                </div>
                <p className="comment-text">{comment.text}</p>
                <small className="comment-timestamp">
                  {comment.timestamp
                    ? new Date(comment.timestamp).toLocaleString("vi-VN")
                    : "Invalid date"}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;