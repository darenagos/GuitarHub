import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import FadePageWrapper from "../components/HOC/FadePageWrapper";

import dgChordLogo from "../assets/dgChordLogo.png";
import LoadingScreen from "./LoadingScreen";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const { session, signInUser } = UserAuth();
  const navigate = useNavigate();
  console.log(session);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate inputs
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      const result = await signInUser(email, password);

      if (result?.success) {
        navigate("/homepage");
        // setShowLoadingScreen(true);
      } else if (result?.error) {
        handleSigninError(result.error);
      }
    } catch (err) {
      handleSigninError(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to provide specific error messages for SignIn
  const handleSigninError = (error) => {
    const errorCode = error?.code || error?.message || "unknown";
    console.error("Signin error:", errorCode);

    if (errorCode.includes("user_not_found")) {
      setError("User does not exist. Please check your email or sign up.");
    } else if (errorCode.includes("wrong_password")) {
      setError("Incorrect password. Please try again.");
    } else {
      setError(`Sign in failed: ${errorCode}`);
    }
  };

  // const handleLoadingScreen = () => {
  //   navigate("/homepage");
  // };

  // if (showLoadingScreen) {
  //   return <LoadingScreen onComplete={handleLoadingScreen} />;
  // }

  return (
    <FadePageWrapper>
      <div className="flex justify-center items-center min-h-screen">
        <form
          role="form"
          onSubmit={handleSignIn}
          className="w-full max-w-md text-gray-800"
        >
          <div className="flex items-center justify-center mb-6">
            <img
              src={dgChordLogo}
              alt="dgChord Logo"
              className=" left-10 w-20 h-20"
            />
            <span className="text-2xl font-semibold">GuitarHub</span>
          </div>

          <h2 className="text-3xl text-center mb-6">Sign in</h2>
          <p className="text-center mb-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-500 hover:text-gray-700">
              Sign up!
            </Link>
          </p>
          <div className="space-y-6">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full p-3 border-b-3 border-black bg-transparent focus:outline-none focus:border-gray-600"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full p-3 border-b-3 border-black bg-transparent focus:outline-none focus:border-gray-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F5F0E1] text-gray-800 
            transition-all duration-300 ease-in-out
            hover:bg-white hover:scale-105  focus:outline-none focus:ring-[#e3d8b3] 
             disabled:bg-[#e8e4d1] disabled:cursor-not-allowed"
            >
              Sign in
            </button>
            {error && (
              <p className="text-red-500 text-center mt-4 p-3 bg-red-50 rounded-md">
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </FadePageWrapper>
  );
};

export default SigninPage;
