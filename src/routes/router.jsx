import React from "react";

import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import Layout from "../components/LayoutComponents/Layout.jsx";
import Homepage from "../pages/Homepage.jsx";
import LearningPage from "../pages/LearningPage.jsx";
import SongDetailPage from "../pages/SongDetailPage.jsx";
import ChordDiagramsPage from "../pages/ChordDiagramsPage.jsx";
import MySongsPage from "../pages/MySongsPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import PrivateRoute from "../components/HOC/PrivateRoute.jsx";
import UserCustomSongDetailPage from "../pages/UserCustomSongDetailPage.jsx";

export const router = createBrowserRouter([
  { path: "/GuitarHub", element: <App /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/signin", element: <SigninPage /> },

  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout /> {/* Layout ensures Navbar persists across private pages */}
      </PrivateRoute>
    ),
    children: [
      { path: "homepage", element: <Homepage /> },
      { path: "learning", element: <LearningPage /> },
      { path: "chord-diagrams", element: <ChordDiagramsPage /> },
      { path: "my-songs", element: <MySongsPage /> },
      { path: "songs/:id", element: <SongDetailPage /> },
      { path: "user-songs/:id", element: <UserCustomSongDetailPage /> },
    ],
  },
]);
