import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPasswprd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { session, signInUser } = UserAuth();
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
    <div>
      <form onSubmit={handleSignIn}>
        <h2>Sign in</h2>
        <p>
          Don't have an account? <Link to="/signup">Sign up !</Link>
        </p>
        <div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            onChange={(e) => setPasswprd(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button type="submit" disabled={loading}>
            Sign in
          </button>
          {error && <p>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default SigninPage;
