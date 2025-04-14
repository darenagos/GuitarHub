//rafce - react arrow function component with export

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import RecentSongs from "../components/HomepageComponents/RecentSongs";
import useFetchSongs from "../hooks/useFetchSongs";
import Notes from "../components/HomepageComponents/Notes";
import LoadingScreen from "./LoadingScreen";

import "../assets/styles/background.css";

import welcomeSmileIcon from "../assets/icons/welcome-smile.png";

const Homepage = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const [showLoadingScreen, setShowLoadingScreen] = useState(() => {
    // Check if this is the first visit in this session
    const hasVisitedBefore = localStorage.getItem("hasVisitedHomepage");
    return !hasVisitedBefore; // Show loading screen only if they haven't visited before
  });

  const { songs, loading, error, fetchSongs } = useFetchSongs(
    session?.user?.id
  );

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("hasVisitedHomepage");
  };

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    localStorage.setItem("hasVisitedHomepage", "true");
  };

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      <FadePageWrapper>
        <div className=" flex flex-col py-5 mt-[10vh] h-[90vh] scrollable-content background-container ">
          <h2 className="flex justify-center items-center mt-8">
            Welcome, {session?.user?.email}
            <img src={welcomeSmileIcon} className=" ml-3 mr-10 h-8 w-8" />
            <button
              onClick={handleSignOut}
              className="pl-5  flex justify-censter items-center  text-gray-800 
            transition-all duration-300 ease-in-out
          hover:scale-105  focus:outline-none focus:ring-[#e3d8b3] 
             disabled:bg-[#e8e4d1] disabled:cursor-not-allowed"
            >
              Sign Out
            </button>
          </h2>

          <div>
            <RecentSongs />
          </div>
          {session?.user?.id && (
            <div>
              <Notes />
            </div>
          )}

          <div className="flex flex-grow justify-center items-end pb-30"></div>
        </div>
      </FadePageWrapper>
    </>
  );
};

export default Homepage;
