import React from "react";

import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage.jsx";
import LearningPage from "../pages/LearningPage.jsx";
import ChordDiagramsPage from "../pages/ChordDiagramsPage.jsx";
import MySongsPage from "../pages/MySongsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/learning" element={<LearningPage />} />
      <Route path="/chord-diagrams" element={<ChordDiagramsPage />} />
      <Route path="/my-songs" element={<MySongsPage />} />
    </Routes>
  );
}

export default AppRoutes;
