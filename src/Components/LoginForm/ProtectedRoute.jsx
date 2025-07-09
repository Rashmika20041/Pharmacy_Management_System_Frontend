import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  if (!user) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
