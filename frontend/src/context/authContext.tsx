// AuthContext.tsx
import { createContext, use, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userId: string;
  setUserId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string>("");
  // "f50967e4-24af-439a-83de-f4b411001c0c"

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
