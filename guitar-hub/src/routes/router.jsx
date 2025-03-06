import React from "react";

import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import Homepage from "../pages/Homepage.jsx";
import LearningPage from "../pages/LearningPage.jsx";
import ChordDiagramsPage from "../pages/ChordDiagramsPage.jsx";
import MySongsPage from "../pages/MySongsPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "signup", element: <SignupPage /> },
  { path: "signin", element: <SigninPage /> },
  { path: "/homepage", element: <Homepage /> },
  { path: "/learning", element: <LearningPage /> },
  { path: "/chord-diagrams", element: <ChordDiagramsPage /> },
  { path: "/my-songs", element: <MySongsPage /> },
]);
