import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { categoryDataType } from "../models/categoryDataType";

// -------------------- Context Type --------------------
interface CategoryContextType {
  categories: categoryDataType[];
  setCategories: React.Dispatch<React.SetStateAction<categoryDataType[]>>;
}

// -------------------- Create Context --------------------
const CategoryContext = createContext<CategoryContextType | null>(null);

// -------------------- Custom Hook --------------------
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within CategoryProvider");
  }
  return context;
};

// -------------------- Provider Component --------------------
export const CategoryContextProvider = ({ children }: PropsWithChildren) => {
  const [categories, setCategories] = useState<categoryDataType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/category/all");
        const data = await response.json();

        // Optional: validate or process data here if needed
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
