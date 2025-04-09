//rafce - react arrow function component with export

import React, { useState } from "react";
import { motion } from "framer-motion";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import RecentSongs from "../components/HomepageComponents/RecentSongs";
import useFetchSongs from "../hooks/useFetchSongs";
import Notes from "../components/HomepageComponents/notes";

const Homepage = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const { songs, loading, error, fetchSongs } = useFetchSongs(
    session?.user?.id
  );

  // console.log(session);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FadePageWrapper>
      <div className="flex flex-col py-5 mt-[10vh] h-[90vh] scrollable-content">
        <h2 className="flex justify-center items-center mt-8">
          Welcome, {session?.user?.email} ☺
          <button
            onClick={handleSignOut}
            className="pl-5  flex justify-center items-center  text-gray-800 
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
        <div>
          <Notes />
        </div>
        <div className="flex flex-grow justify-center items-end pb-30"></div>
      </div>
    </FadePageWrapper>
  );
};

export default Homepage;
