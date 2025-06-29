import { useParams } from "react-router-dom";
import "../styles/recipeDetail.css";
import { useEffect, useState } from "react";

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
            carbs: data.nutritional_info?.carbs || 0
          },
          comments: data.comments || [],
          tags: data.tags || [],
          shareUrl: data.share_url || ""
        };
        setRecipeData(mappedData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchRecipeData();
  }, [id]);

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
        userName: userName.trim(),
        comment: newComment.trim(),
        rating: userRating,
      };
      // console.log(typeof userName, typeof newComment, typeof userRating);
      const response = await fetch(`http://127.0.0.1:5000/recipe/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

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
            carbs: updatedData.nutritional_info?.carbs || 0
          },
          comments: updatedData.comments || [],
          tags: updatedData.tags || [],
          shareUrl: updatedData.share_url || ""
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
          className={`star ${interactive ? 'interactive' : ''} ${
            i <= (interactive ? (hoveredRating || userRating) : rating) ? 'filled' : ''
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

  // console.log(recipeData);
  
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
        <span>{renderStarRating(Math.round(recipeData.avgRating))} {recipeData.avgRating.toFixed(1)} ({recipeData.numberOfRating} đánh giá)</span>
        <span>⏱ {recipeData.cookingTime} mins</span>
        <span>🍽 {recipeData.servings} servings</span>
      </div>

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
                {userRating > 0 ? `${userRating}/5 sao` : 'Chọn rating'}
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

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
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
                    ? new Date(comment.timestamp).toLocaleString('vi-VN')
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