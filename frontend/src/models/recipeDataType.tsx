// export interface recipe_data_type {
//     id: string;
//     title: string;
//     description: string;
//     image: string;
//     ingredients: string[];
//     instructions: string;
//     cooking_time: number;
//     servings: number;
//     category: string;
//     total_score: number;
//     number_of_rating: number;
//     avg_rating: number;
//     nutritionalInfo: {
//         calories: number;
//         protein: number;
//         fat: number;
//         carbs: number
//     };
//     comments: {
//         text: string;
//         username: string
//     }[];
//     tags: string[];
//     share_url: string
// }

export interface recipeInfoType {
  id: string;
  title: string;
  description: string;
  image: string;
  instructions: string;
  cookingTime: number;
  servings: number;
  category: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  tags: string[];
  shareUrl: string;
}

export interface recipeIngredientType {
  ingredients: string[];
}

export interface recipeRatingType {
  totalScore: number;
  numberOfRating: number;
  avgRating: number;
}

export interface recipeCommentType {
  comments: {
    text: string;
    userName: string;
    timestamp: string;
  }[];
}

// export interface RecipeSummary {
//   id: string;
//   title: string;
//   image: string;
//   description: string;
//   instructions: string;
//   avg_rating: number;
//   cooking_time: number;
//   servings: number;
//   category: string[];
//   tags: string[];
//   ingredients: string[];
// }
