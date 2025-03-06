//rafce - react arrow function component with export

import React from "react";
import NavBar from "../components/Navbar";
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
    <>
      <NavBar />
      <h2>Welcome, {session?.user?.email}</h2>
      <div>
        <p onClick={handleSignOut}>Sign Out</p>
      </div>
    </>
  );
};

export default Homepage;
