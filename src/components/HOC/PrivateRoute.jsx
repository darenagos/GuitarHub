import React from "react";
import { UserAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute component: A higher-order component that checks if a user is authenticated before rendering the child components.
 * If not authenticated, it redirects to the signup page.
 */
const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }
  return <>{session ? <>{children}</> : <Navigate to="/signup" />}</>;
};

export default PrivateRoute;
