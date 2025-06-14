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

export interface recipe_info_type{
    id: string;
    title: string;
    description: string;
    image: string;
    instructions: string;
    cooking_time: number;
    servings: number;
    category: string;
    nutritionalInfo: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number
    };
    tags: string[];
    share_url: string
}

export interface recipe_ingredient_type{
    ingredients: string[];
}

export interface recipe_rating_type{
    total_score: number;
    number_of_rating: number;
    avg_rating: number;
}

export interface recipe_comment_type{
    comments: {
        text: string;
        username: string
    }[];
}