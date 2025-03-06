import React from "react";

import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import Homepage from "../pages/Homepage.jsx";
import LearningPage from "../pages/LearningPage.jsx";
import ChordDiagramsPage from "../pages/ChordDiagramsPage.jsx";
import MySongsPage from "../pages/MySongsPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "signin", element: <SigninPage /> },
  {
    path: "/homepage",
    element: (
      <PrivateRoute>
        <Homepage />
      </PrivateRoute>
    ),
  },
  {
    path: "/learning",
    element: (
      <PrivateRoute>
        <LearningPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/chord-diagrams",
    element: (
      <PrivateRoute>
        <ChordDiagramsPage />{" "}
      </PrivateRoute>
    ),
  },
  {
    path: "/my-songs",
    element: (
      <PrivateRoute>
        <MySongsPage />{" "}
      </PrivateRoute>
    ),
  },
]);
