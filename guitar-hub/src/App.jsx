import React from "react";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./ErrorBoundary";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import LearningPage from "./routes/LearningPage.jsx";
import ChordDiagramsPage from "./routes/ChordDiagramsPage.jsx";
import MySongsPage from "./routes/MySongsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/chord-diagrams" element={<ChordDiagramsPage />} />
        <Route path="/my-songs" element={<MySongsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
