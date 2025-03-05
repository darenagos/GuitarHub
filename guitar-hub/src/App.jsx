import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/index.jsx";
import { BrowserRouter } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
