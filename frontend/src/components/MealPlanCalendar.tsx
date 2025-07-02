import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import '../styles/MealPlanCalendar.css';

interface Recipe {
  id: string;
  title: string;
  image: string;
  description: string;
  avg_rating: number;
  posted_by: string;
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner';
  recipe_id: string;
  recipe?: Recipe; // Populated after fetching recipe details
}

interface MealPlan {
  date: string; // Format: "YYYY-MM-DD"
  meals: Meal[];
}


interface WeeklyMealPlanCalendarProps {
  className?: string;
}

const WeeklyMealPlanCalendar: React.FC<WeeklyMealPlanCalendarProps> = ({ className }) => {
  const { userId } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Map<string, Recipe>>(new Map());
  const [draggedMeal, setDraggedMeal] = useState<{ meal: Meal; sourceDate: string } | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Danh sách các ngày trong tuần
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  // Tạo ngày cho tuần hiện tại
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Bắt đầu từ thứ 2
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  // Convert Date to YYYY-MM-DD format
  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  

  // Fetch recipe details by ID
  const fetchRecipe = async (recipeId: string): Promise<Recipe | null> => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://127.0.0.1:5000/recipe/${recipeId}`);
      if (response.ok) {
        const recipe = await response.json();
        return recipe;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
      return null;
    }
  };

  // Fetch meal plans for the current week
  const fetchMealPlans = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      
      // Replace with your actual API endpoint
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}/meal_plans`);
      
      if (response.ok) {
        const data = await response.json();
        setMealPlans(data);

        // Collect all unique recipe IDs
        const recipeIds = new Set<string>();
        data.forEach((plan: { meals: any[]; }) => 
          plan.meals.forEach(meal => recipeIds.add(meal.recipe_id))
        );

        // Fetch recipe details for all unique recipe IDs
        const recipePromises = Array.from(recipeIds).map(async (recipeId) => {
          if (!recipes.has(recipeId)) {
            const recipe = await fetchRecipe(recipeId);
            return { recipeId, recipe };
          }
          return null;
        });

        const recipeResults = await Promise.all(recipePromises);
        const newRecipes = new Map(recipes);
        
        recipeResults.forEach(result => {
          if (result && result.recipe) {
            newRecipes.set(result.recipeId, result.recipe);
          }
        });

        setRecipes(newRecipes);
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, [userId, currentWeek]);

  const handleDragStart = (e: React.DragEvent, meal: Meal, sourceDate: string) => {
    setDraggedMeal({ meal, sourceDate });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetDate: string, targetMealType: string) => {
    e.preventDefault();
    
    if (!draggedMeal) return;

    const { meal, sourceDate } = draggedMeal;
    
    // Don't do anything if dropped in the same position
    if (sourceDate === targetDate && meal.type === targetMealType) {
      setDraggedMeal(null);
      return;
    }

    // const updatedMealPlans = [...mealPlans];
    console.log(JSON.stringify({
          user_id: userId,
          source_date: sourceDate,
          source_meal_type: meal.type,
          target_date: targetDate,
          target_meal_type: targetMealType,
          recipe_id: meal.recipe_id
        }));
    try {
      // Update meal plan on server
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}/meal_plans`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          source_date: sourceDate,
          source_meal_type: meal.type,
          target_date: targetDate,
          target_meal_type: targetMealType,
          recipe_id: meal.recipe_id
        }]),
      });

      if (response.ok) {
        // Update local state
        const updatedMealPlans = mealPlans.map(plan => {
          if (plan.date === sourceDate) {
            // Remove meal from source
            return {
              ...plan,
              meals: plan.meals.filter(m => !(m.type === meal.type && m.recipe_id === meal.recipe_id))
            };
          } else if (plan.date === targetDate) {
            // Add/update meal in target
            const filteredMeals = plan.meals.filter(m => m.type !== targetMealType);
            return {
              ...plan,
              meals: [...filteredMeals, { type: targetMealType as 'breakfast' | 'lunch' | 'dinner', recipe_id: meal.recipe_id }]
            };
          }
          return plan;
        });

        // If target date doesn't exist in meal plans, create it
        const targetExists = mealPlans.some(plan => plan.date === targetDate);
        if (!targetExists) {
          updatedMealPlans.push({
            date: targetDate,
            meals: [{ type: targetMealType as 'breakfast' | 'lunch' | 'dinner', recipe_id: meal.recipe_id }]
          });
        }

        setMealPlans(updatedMealPlans);
      }
    } catch (error) {
      console.error('Error updating meal plan:', error);
    } finally {
      setDraggedMeal(null);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getMealForDateAndType = (date: string, mealType: string): { meal: Meal; recipe: Recipe } | null => {
    const plan = mealPlans.find(plan => plan.date === date);
    if (!plan) return null;

    const meal = plan.meals.find(m => m.type === mealType);
    if (!meal) return null;

    const recipe = recipes.get(meal.recipe_id);
    if (!recipe) return null;

    return { meal, recipe };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const removeMealFromPlan = async (date: string, mealType: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}/meal_plans`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          date: date,
          meal_type: mealType
        }]),
      });

      if (response.ok) {
        // Update local state
        const updatedMealPlans = mealPlans.map(plan => {
          if (plan.date === date) {
            return {
              ...plan,
              meals: plan.meals.filter(meal => meal.type !== mealType)
            };
          }
          return plan;
        }).filter(plan => plan.meals.length > 0); // Remove empty meal plans

        setMealPlans(updatedMealPlans);
      }
    } catch (error) {
      console.error('Error removing meal from plan:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading meal plans...</div>;
  }

  return (
    <div className={`weekly-meal-calendar ${className || ''}`}>
      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateWeek('prev')}>
          ←
        </button>
        <h3>
          Meal Plan - Week of {formatDate(weekDates[0])} to {formatDate(weekDates[6])}
        </h3>
        <button className="nav-button" onClick={() => navigateWeek('next')}>
          →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="meal-types-column">
          <div className="meal-type-header"></div>
          {mealTypes.map(mealType => (
            <div key={mealType} className="meal-type-label">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </div>
          ))}
        </div>

        {weekDates.map((date, dayIndex) => {
          const dateString = formatDateForAPI(date);
          const dayName = daysOfWeek[dayIndex];
          
          return (
            <div key={dateString} className="day-column">
              <div className="day-header">
                <div className="day-name">{dayName}</div>
                <div className="day-date">{formatDate(date)}</div>
              </div>
              
              {mealTypes.map(mealType => {
                const mealData = getMealForDateAndType(dateString, mealType);
                
                return (
                  <div
                    key={`${dateString}-${mealType}`}
                    className="meal-slot"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dateString, mealType)}
                  >
                    {mealData ? (
                      <div
                        className="meal-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, mealData.meal, dateString)}
                      >
                        <img src={mealData.recipe.image} alt={mealData.recipe.title} className="meal-image" />
                        <div className="meal-info">
                          <h4 className="meal-title">{mealData.recipe.title}</h4>
                          <div className="meal-rating">★ {mealData.recipe.avg_rating}</div>
                          <div className="meal-author">by {mealData.recipe.posted_by}</div>
                        </div>
                        <button 
                          className="remove-meal-btn"
                          onClick={() => removeMealFromPlan(dateString, mealType)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="empty-meal-slot">
                        <span>Drop recipe here</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMealPlanCalendar;