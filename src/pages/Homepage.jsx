import React, { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import Dashboard from "../components/HomepageComponents/Dashboard";
import Notes from "../components/HomepageComponents/Notes";
import LoadingScreen from "./LoadingScreen";

import "../assets/styles/background.css";
import welcomeSmileIcon from "../assets/icons/welcome-smile.png";

const Homepage = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    if (!session) return; // wait for session to be available

    const justSignedIn = localStorage.getItem("justSignedIn");
    const hasVisitedBefore = localStorage.getItem("hasVisitedHomepage");

    console.log("Visited before?", hasVisitedBefore);
    console.log("Just signed in?", justSignedIn);
    console.log("Session available?", session);

    if (justSignedIn === "true" || !hasVisitedBefore) {
      setShowLoadingScreen(true);
    }

    setInitialCheckDone(true);
  }, [session]);

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
    localStorage.removeItem("justSignedIn");
  };

  // Doesnt render anything until session check is complete
  if (!initialCheckDone) return null;

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      <FadePageWrapper>
        <div className="flex flex-col py-5 mt-[10vh] h-[90vh] scrollable-content background-container">
          <h2 className="flex justify-center items-center mt-8">
            Welcome, {session?.user?.email?.split("@")[0]}
            <img src={welcomeSmileIcon} className="ml-3 mr-10 h-8 w-8" />
            <button
              onClick={handleSignOut}
              className="pl-5 flex justify-center items-center text-gray-600 
                transition-all duration-200 ease-in-out
                 focus:outline-none focus:ring-[#e3d8b3] cursor-pointer hover:text-[#9cd0cd] hover:decoration-gray-300
                disabled:bg-[#e8e4d1] disabled:cursor-not-allowed underline decoration-[#9cd0cd] "
            >
              Sign Out
            </button>
          </h2>

          <div>
            <Dashboard />
          </div>

          {session?.user?.id && <Notes />}

          <div className="flex flex-grow justify-center items-end pb-30"></div>
        </div>
      </FadePageWrapper>
    </>
  );
};

export default Homepage;
