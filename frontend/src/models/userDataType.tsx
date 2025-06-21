// export interface user_data_type {
//   id: string;
//   username: string;
//   email: string;
//   password: string;
//   avatar: string;
//   favorites: string[];
//   ratings: {
//     recipe_id: string;
//     score: number;
//   }[];
//   meal_plans: {
//     date: string;
//     meals: {
//       type: string;
//       recipe_id: string;
//     }[];
//   }[];
//   comments: {
//     recipe_id: string;
//     text: string;
//     timestamp: string;
//   }[];
//   preferences: {
//     diet: string;
//     allergies: string[];
//   };
//   view_history: {
//     recipe_id: {
//       view_count: number;
//       total_duration: number;
//       last_viewed_at: string;
//       just_viewed: {
//         start: string;
//         end: string;
//         duration: number;
//       };
//     };
//   }[];
// }

export interface userProfileType {
  id: string;
  userName: string;
  email: string;
  avatar: string;
  preferences: {
    diet: string;
    allergies: string[];
  };
}

export interface userFavoriteAndRatingType {
  favorites: string[];
  ratings: {
    recipeId: string;
    score: number;
  }[];
}

export interface userMealPlansType {
  mealPlans: {
    date: string;
    meals: {
      type: string;
      recipeId: string;
    }[];
  }[];
}

export interface userCommentType {
  comments: {
    recipeId: string;
    text: string;
    timestamp: string;
  }[];
}

export interface userViewHistoryType {
  viewHistory: {
    recipeId: {
      viewCount: number;
      totalDuration: number;
      lastViewedAt: string;
      justViewed: {
        start: string;
        end: string;
        duration: number;
      };
    };
  }[];
}
