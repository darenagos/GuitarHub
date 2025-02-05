import React from "react";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./ErrorBoundary";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import Learning from "./routes/Learning.jsx";
import ChordDiagrams from "./routes/ChordDiagrams.jsx";
import MySongs from "./routes/MySongs.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/chord-diagrams" element={<ChordDiagrams />} />
        <Route path="/my-songs" element={<MySongs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
