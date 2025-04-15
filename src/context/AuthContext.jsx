import React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

/**
 * AuthContextProvider Component
 * Provides authentication-related functions (sign up, sign in, sign out) and manages user session state.
 * Utilizes Supabase for authentication and tracks session state across the application using React Context.
 * Exposes authentication methods and session data to child components.
 */

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("There was a problem signing up:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("sign in error occured", error);
        throw new Error(error.message);
      }
      return { success: true, data };
    } catch (error) {
      console.error("an error occured", error);
      throw error;
    }
  };

  // listen for state in an auth state so we can update our app - will use useEffect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("there was an error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signInUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
