//rafce - react arrow function component with export

import React, { useState } from "react";
import { motion } from "framer-motion";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Homepage = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  console.log(session);

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
      <div className="flex flex-col py-5 mt-[10vh] h-[90vh]">
        <h2 className="flex justify-center items-center mt-8">
          Welcome, {session?.user?.email} ☺
        </h2>
        <div className="flex flex-grow justify-center items-end pb-30">
          <button
            onClick={handleSignOut}
            className="w-30 py-3  text-gray-800 
            transition-all duration-300 ease-in-out
          hover:scale-105  focus:outline-none focus:ring-[#e3d8b3] 
             disabled:bg-[#e8e4d1] disabled:cursor-not-allowed"
          >
            Sign Out
          </button>
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default Homepage;
