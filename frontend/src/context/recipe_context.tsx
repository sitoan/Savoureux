import { createContext, useContext, useState } from 'react';
import type { recipe_info_type, recipe_ingredient_type, recipe_rating_type, recipe_comment_type } from '../models/recipe_data_type'; 

type recipe_info_context_type = {
    recipe_info: recipe_info_type;
    update_recipe_item: (new_recipe_item: recipe_info_type) => void;
};

type recipe_ingredient_context_type = {
    recipe_ingredient: recipe_ingredient_type;
    update_recipe_ingredient: (new_recipe_ingredient: recipe_ingredient_type) => void;
};

type recipe_rating_context_type = {
    recipe_rating: recipe_rating_type;
    update_recipe_rating: (new_recipe_rating: recipe_rating_type) => void;
};

type recipe_comment_context_type = {
    recipe_comment: recipe_comment_type;
    update_recipe_comment: (new_recipe_comment: recipe_comment_type) => void;
};

const recipe_info_context = createContext<recipe_info_context_type | null>(null);
const recipe_ingredient_context = createContext<recipe_ingredient_context_type | null>(null);
const recipe_rating_context = createContext<recipe_rating_context_type | null>(null);
const recipe_comment_context = createContext<recipe_comment_context_type | null>(null);

export const use_recipe_info_context = () => {
  const context = useContext(recipe_info_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};

export const use_recipe_ingredient_context = () => {
  const context = useContext(recipe_ingredient_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};

export const use_recipe_rating_context = () => {
  const context = useContext(recipe_rating_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};

export const use_recipe_comment_context = () => {
  const context = useContext(recipe_comment_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};

export const recipe_context_provider = ({ children }: { children: React.ReactNode }) => {
  const [recipe_info, set_recipe_info] = useState<recipe_info_type>(null!);
  const [recipe_ingredient, set_recipe_ingredient] = useState<recipe_ingredient_type>(null!);
  const [recipe_rating, set_recipe_rating] = useState<recipe_rating_type>(null!);
  const [recipe_comment, set_recipe_comment] = useState<recipe_comment_type>(null!);

  const update_recipe_item = (new_recipe_item: recipe_info_type) => {
    set_recipe_info(new_recipe_item);
  };
  const update_recipe_ingredient = (new_recipe_ingredient: recipe_ingredient_type) => {
    set_recipe_ingredient(new_recipe_ingredient);
  };
  const update_recipe_rating = (new_recipe_rating: recipe_rating_type) => {
    set_recipe_rating(new_recipe_rating);
  };
  const update_recipe_comment = (new_recipe_comment: recipe_comment_type) => {
    set_recipe_comment(new_recipe_comment);
  };



  return (
    <recipe_info_context.Provider value={{ recipe_info, update_recipe_item }}>
      <recipe_ingredient_context.Provider value={{ recipe_ingredient, update_recipe_ingredient }}>
        <recipe_rating_context.Provider value={{ recipe_rating, update_recipe_rating }}>
          <recipe_comment_context.Provider value={{ recipe_comment, update_recipe_comment }}>
            {children}
          </recipe_comment_context.Provider>
        </recipe_rating_context.Provider>
      </recipe_ingredient_context.Provider>
    </recipe_info_context.Provider>
  );
};