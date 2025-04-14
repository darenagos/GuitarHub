import { Outlet } from "react-router-dom";
import Navbar from "../Navbar"; // Adjust path based on your folder structure
import { AnimatePresence } from "framer-motion";

const Layout = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <main className="flex-grow">
          <Outlet /> {/* This renders the current page component */}
        </main>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
