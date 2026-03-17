import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const {auth} = useAuth();

  if (!auth.token) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(auth.role)) return <Navigate to="/login" />;

    return children;
};

export default PrivateRoute;