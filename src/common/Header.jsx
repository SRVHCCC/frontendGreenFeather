import React from "react";
import Navbar from "../components/layout/Navbar";

const Header = () => {
  return (
    <header>
      <Navbar />
      {/* Spacer to offset fixed navbar height */}
    </header>
  );
};

export default Header;
