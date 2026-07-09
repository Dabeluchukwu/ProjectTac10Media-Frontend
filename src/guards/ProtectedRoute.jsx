import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Existing token check
  const token = localStorage.getItem("token");

  // User from Zustand store
  const { user } = useAuthStore();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "student":
        return <Navigate to="/dashboard" replace />;
      case "client":
        return <Navigate to="/dashboard" replace />;  // Client goes to dashboard for now
      case "instructor":
        return <Navigate to="/instructor/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "superAdmin":  // ✅ ADD THIS
        return <Navigate to="/super-admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Support both children and nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;