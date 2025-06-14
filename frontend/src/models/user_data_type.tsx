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

export interface user_profile_type {
  id: string;
  username: string;
  email: string;
  avatar: string;
  preferences: {
    diet: string;
    allergies: string[];
  };
}

export interface user_favorite_and_rating_type {
  favorites: string[];
  ratings: {
    recipe_id: string;
    score: number;
  }[];
}

export interface user_meal_plans_type {
  meal_plans: {
    date: string;
    meals: {
      type: string;
      recipe_id: string;
    }[];
  }[];
}

export interface user_comments_type {
  comments: {
    recipe_id: string;
    text: string;
    timestamp: string;
  }[];
}

export interface user_view_history_type {
  view_history: {
    recipe_id: {
      view_count: number;
      total_duration: number;
      last_viewed_at: string;
      just_viewed: {
        start: string;
        end: string;
        duration: number;
      };
    };
  }[];
}
