import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactElement;
  restricted?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If the route is restricted (like login/register) and user is authenticated, redirect to dashboard
  if (isAuthenticated && restricted) {
    const from = location.state?.from?.pathname || "/app/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
};
