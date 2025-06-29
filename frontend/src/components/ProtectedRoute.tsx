import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // chỉnh đường dẫn nếu cần

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();

  if (!userId) {
    return <Navigate to="/log-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
