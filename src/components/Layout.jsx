// Layout.jsx
import React from 'react';
import Navbar from './Nav/Navbar';
import Footer from './Footer/Footer';
import { Outlet } from "react-router-dom";
import './Layout.css'; // 新增样式文件

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <Outlet/>
      <main className="layout-content">
        {children}
      </main>
      <Footer />
      
    </div>
  );
};

export default Layout;