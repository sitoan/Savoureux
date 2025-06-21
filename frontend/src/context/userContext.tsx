import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type {
  userProfileType,
  userFavoriteAndRatingType,
  userCommentType,
  userMealPlansType,
  userViewHistoryType,
} from "../models/userDataType";
import { useAuth } from "./authContext";

// ---------------- Context types ----------------
interface UserProfileContextType {
  userProfile: userProfileType | null;
  updateUserProfile: (newUserItem: userProfileType) => void;
}

interface UserFavoriteAndRatingContextType {
  userFavoriteAndRating: userFavoriteAndRatingType | null;
  updateUserFavoriteAndRating: (newUserItem: userFavoriteAndRatingType) => void;
}

interface UserMealPlansContextType {
  userMealPlans: userMealPlansType | null;
  updateUserMealPlans: (newUserItem: userMealPlansType) => void;
}

interface UserCommentContextType {
  userComment: userCommentType | null;
  updateUserComments: (newUserItem: userCommentType) => void;
}

interface UserViewHistoryContextType {
  userViewHistory: userViewHistoryType | null;
  updateUserViewHistory: (newUserItem: userViewHistoryType) => void;
}

// ---------------- Create contexts ----------------
export const UserProfileContext = createContext<UserProfileContextType | null>(null);
export const UserFavoriteAndRatingContext = createContext<UserFavoriteAndRatingContextType | null>(null);
export const UserMealPlansContext = createContext<UserMealPlansContextType | null>(null);
export const UserCommentContext = createContext<UserCommentContextType | null>(null);
export const UserViewHistoryContext = createContext<UserViewHistoryContextType | null>(null);

// ---------------- Custom hooks ----------------
export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error("useUserProfileContext must be used within UserContextProvider");
  return context;
};

export const useUserFavoriteAndRatingContext = () => {
  const context = useContext(UserFavoriteAndRatingContext);
  if (!context) throw new Error("useUserFavoriteAndRatingContext must be used within UserContextProvider");
  return context;
};

export const useUserMealPlansContext = () => {
  const context = useContext(UserMealPlansContext);
  if (!context) throw new Error("useUserMealPlansContext must be used within UserContextProvider");
  return context;
};

export const useUserCommentContext = () => {
  const context = useContext(UserCommentContext);
  if (!context) throw new Error("useUserCommentContext must be used within UserContextProvider");
  return context;
};

export const useUserViewHistoryContext = () => {
  const context = useContext(UserViewHistoryContext);
  if (!context) throw new Error("useUserViewHistoryContext must be used within UserContextProvider");
  return context;
};

// ---------------- Provider component ----------------
export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const { userId } = useAuth();

  const [userProfile, setUserProfile] = useState<userProfileType | null>(null);
  const [userFavoriteAndRating, setUserFavoriteAndRating] = useState<userFavoriteAndRatingType | null>(null);
  const [userMealPlans, setUserMealPlans] = useState<userMealPlansType | null>(null);
  const [userComment, setUserComment] = useState<userCommentType | null>(null);
  const [userViewHistory, setUserViewHistory] = useState<userViewHistoryType | null>(null);

  const updateUserProfile = (newProfile: userProfileType) => setUserProfile(newProfile);
  const updateUserFavoriteAndRating = (newFav: userFavoriteAndRatingType) => setUserFavoriteAndRating(newFav);
  const updateUserMealPlans = (newPlans: userMealPlansType) => setUserMealPlans(newPlans);
  const updateUserComments = (newComments: userCommentType) => setUserComment(newComments);
  const updateUserViewHistory = (newHistory: userViewHistoryType) => setUserViewHistory(newHistory);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);
        const data = await response.json();

        setUserProfile({
          id: data.id,
          userName: data.username,
          email: data.email,
          avatar: data.avatar,
          preferences: data.preferences,
        });

        setUserFavoriteAndRating({
          favorites: data.favorites,
          ratings: data.ratings,
        });

        setUserMealPlans(data.mealPlans);
        setUserComment(data.comments);
        setUserViewHistory(data.view_history);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <UserProfileContext.Provider value={{ userProfile, updateUserProfile }}>
      <UserFavoriteAndRatingContext.Provider value={{ userFavoriteAndRating, updateUserFavoriteAndRating }}>
        <UserMealPlansContext.Provider value={{ userMealPlans, updateUserMealPlans }}>
          <UserCommentContext.Provider value={{ userComment, updateUserComments }}>
            <UserViewHistoryContext.Provider value={{ userViewHistory, updateUserViewHistory }}>
              {children}
            </UserViewHistoryContext.Provider>
          </UserCommentContext.Provider>
        </UserMealPlansContext.Provider>
      </UserFavoriteAndRatingContext.Provider>
    </UserProfileContext.Provider>
  );
};
