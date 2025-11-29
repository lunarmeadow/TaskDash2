
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import auth from "./auth-helper.js";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const jwt = auth.isAuthenticated();

  if (!jwt) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
