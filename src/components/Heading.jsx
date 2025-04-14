import React, { Component } from "react";
import { useLocation } from "react-router-dom";

const Heading = () => {
  const location = useLocation();

  //define headings based on the current path

  const getHeading = () => {
    switch (location.pathname) {
      case "/chord-diagrams":
        return "Chord Diagrams";
      case "/learning":
        return "Learning";
      case "/my-songs":
        return "My Songs";
      default:
        return "Welcome to Guitar Hub Homepage";
    }
  };

  return <h1 className="heading">{getHeading()}</h1>;
};

export default Heading;
