import { createContext, useContext, useEffect, useState } from "react";
import type {
  user_profile_type,
  user_favorite_and_rating_type,
  user_meal_plans_type,
  user_comments_type,
  user_view_history_type,
} from "../models/user_data_type";
import { useAuth } from "./auth_context";

interface user_profile_context_type {
  user_profile: user_profile_type;
  update_user_profile: (new_user_item: user_profile_type) => void;
}
interface user_favorite_and_rating_cotext_type {
  user_favorite_and_rating: user_favorite_and_rating_type;
  update_user_favorite_and_rating: (
    new_user_item: user_favorite_and_rating_type
  ) => void;
}
interface user_meal_plans_context_type {
  user_meal_plans: user_meal_plans_type;
  update_user_meal_plans: (new_user_item: user_meal_plans_type) => void;
}
interface user_comments_context_type {
  user_comments: user_comments_type;
  update_user_comments: (new_user_item: user_comments_type) => void;
}
interface user_view_history_context_type {
  user_view_history: user_view_history_type;
  update_user_view_history: (new_user_item: user_view_history_type) => void;
}

export const user_profile_context =
  createContext<user_profile_context_type | null>(null);
export const user_favorite_and_rating_context =
  createContext<user_favorite_and_rating_cotext_type | null>(null);
export const user_meal_plans_context =
  createContext<user_meal_plans_context_type | null>(null);
export const user_comments_context =
  createContext<user_comments_context_type | null>(null);
export const user_view_history_context =
  createContext<user_view_history_context_type | null>(null);

export const use_user_profile_context = () => {
  const context = useContext(user_profile_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};
export const use_user_favorite_and_rating_context = () => {
  const context = useContext(user_favorite_and_rating_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};
export const use_user_meal_plans_context = () => {
  const context = useContext(user_meal_plans_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};
export const use_user_comments_context = () => {
  const context = useContext(user_comments_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};
export const use_user_view_history_context = () => {
  const context = useContext(user_view_history_context);
  if (!context) {
    throw new Error(
      "use_user_context must be used within a user_context_provider"
    );
  }
  return context;
};

export const user_context_provider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user_id } = useAuth();
  const [user_profile, set_user_profile] = useState<user_profile_type>(null!);
  const [user_favorite_and_rating, set_user_favorite_and_rating] =
    useState<user_favorite_and_rating_type>(null!);
  const [user_meal_plans, set_user_meal_plans] = useState<user_meal_plans_type>(
    null!
  );
  const [user_comments, set_user_comments] = useState<user_comments_type>(
    null!
  );
  const [user_view_history, set_user_view_history] =
    useState<user_view_history_type>(null!);

  const update_user_profile = (new_user_profile: user_profile_type) => {
    set_user_profile(new_user_profile);
  };
  const update_user_favorite_and_rating = (
    new_user_favorite_and_rating: user_favorite_and_rating_type
  ) => {
    set_user_favorite_and_rating(new_user_favorite_and_rating);
  };
  const update_user_meal_plans = (
    new_user_meal_plans: user_meal_plans_type
  ) => {
    set_user_meal_plans(new_user_meal_plans);
  };
  const update_user_comments = (new_user_comments: user_comments_type) => {
    set_user_comments(new_user_comments);
  };
  const update_user_view_history = (
    new_user_view_history: user_view_history_type
  ) => {
    set_user_view_history(new_user_view_history);
  };

  useEffect(() => {
    const fetch_user_data = async () => {
      if (!user_id) return;
      try {
        const response = await fetch("http://127.0.0.1:5000/user/" + user_id);
        const data = await response.json();
        set_user_profile({
          id: data.id,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          preferences: data.preferences,
        });
        set_user_favorite_and_rating({
          favorites: data.favorites,
          ratings: data.ratings,
        });
        set_user_meal_plans(data.meal_plans);
        set_user_comments(data.comments);
        set_user_view_history(data.view_history);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetch_user_data();
  }, [user_id]);

  return (
    <user_profile_context.Provider
      value={{ user_profile, update_user_profile }}
    >
      <user_favorite_and_rating_context.Provider
        value={{
          user_favorite_and_rating,
          update_user_favorite_and_rating,
        }}
      >
        <user_meal_plans_context.Provider
          value={{
            user_meal_plans,
            update_user_meal_plans,
          }}
        >
          <user_comments_context.Provider
            value={{ user_comments, update_user_comments }}
          >
            <user_view_history_context.Provider
              value={{
                user_view_history,
                update_user_view_history,
              }}
            >
              {children}
            </user_view_history_context.Provider>
          </user_comments_context.Provider>
        </user_meal_plans_context.Provider>
      </user_favorite_and_rating_context.Provider>
    </user_profile_context.Provider>
  );
};
