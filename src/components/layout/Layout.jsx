import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import SidebarFilter from "../../common/SidebarFilter";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
