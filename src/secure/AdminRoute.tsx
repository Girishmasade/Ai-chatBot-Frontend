import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isEmployee = currentUser?.role === "Administrator" || currentUser?.role === "Developer";

  if (!isEmployee) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};
