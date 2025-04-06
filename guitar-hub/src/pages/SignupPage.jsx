import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();
  console.log(session);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate("/homepage");
      }
    } catch (err) {
      setError("an error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSignIn} className="w-full max-w-md text-gray-800">
        <h2 className="text-3xl text-center mb-6 ">Sign up</h2>

        <p className="text-center mb-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-gray-500 hover:text-gray-700">
            Sign in!
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
             hover:bg-white hover:scale-105 
             focus:outline-none focus:ring-[#e3d8b3] 
             disabled:bg-[#e8e4d1] disabled:cursor-not-allowed"
          >
            Sign up
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default SignupPage;
