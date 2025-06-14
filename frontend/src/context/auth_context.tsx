// AuthContext.tsx
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user_id: number | null;
  setuser_id: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user_id, setuser_id] = useState<number | null>(null);

  return (
    <AuthContext.Provider value={{ user_id, setuser_id }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
