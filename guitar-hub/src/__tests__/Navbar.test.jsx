import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { MemoryRouter } from "react-router-dom";

test("renders the Navbar component", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  const homepageLink = screen.getByText("Homepage");
  const learningLink = screen.getByText("Learning");
  const chordDiagramsLink = screen.getByText("Chord Diagrams");
  const mySongsLink = screen.getByText("My Songs");

  expect(homepageLink).toBeInTheDocument();
  expect(learningLink).toBeInTheDocument();
  expect(chordDiagramsLink).toBeInTheDocument();
  expect(mySongsLink).toBeInTheDocument();
});
