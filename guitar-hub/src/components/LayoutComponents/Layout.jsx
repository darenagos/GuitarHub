import { Outlet } from "react-router-dom";
import Navbar from "../Navbar"; // Adjust path based on your folder structure

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This renders the current page component */}
      </main>
    </div>
  );
};

export default Layout;
