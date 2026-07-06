"use client";

import { useState } from "react";
import DarkModeToggle from "./components/DarkModeToggle";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import MobileBottomNav from "./components/MobileBottomNav";
import LeftSidebar from "./components/LeftSidebar";
import MiddleFeed from "./components/MiddleFeed";
import RightSidebar from "./components/RightSidebar";

export default function Feed() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`_layout _layout_main_wrapper${darkMode ? " _dark_wrapper" : ""}`}
    >
      <DarkModeToggle onToggle={() => setDarkMode((prev) => !prev)} />
      <div className="_main_layout">
        <Header />
        <MobileMenu />
        <MobileBottomNav />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <LeftSidebar />
              <MiddleFeed />
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
