import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

import { Button } from "../../ui/button";
import { LeftSideMenuData } from "./MenuData";

function LeftSectionsDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const collapseTimeoutRef = useRef(null);
  const { pathname } = useLocation();

  const handleMouseLeave = () => {
    collapseTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, 200);
  };

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    setIsCollapsed(false);
  };

  const linkOne =
    pathname.split("/").slice(1, 3).at(-1)?.toLocaleLowerCase() || "";
  const link2 = pathname.split("/").slice(0, 2).at(-1);
  const activeLink = linkOne?.length > 20 ? link2 : linkOne;

  const signOut = () => {
    console.log("Sign out clicked!");
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hidden md:flex flex-col bg-gradient-to-b cursor-pointer from-[#0A66C2] to-[#004B93] text-white relative transition-all duration-100 ease-in-out p-3 ${
        isCollapsed ? "w-16" : "w-56"
      } shadow-lg`}
    >
      <div className="flex items-center justify-center h-24 max-h-24">
        <Link to="/" className="flex flex-col items-center font-semibold">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F1F5F9] dark:bg-[#111827] transition-colors duration-300">
            <img src="/B-logo.png" alt="logo" width={48} height={48} />
          </div>
          <div className={`mt-2 ${isCollapsed ? "invisible" : "visible"}`}>
            <span className="font-bold text-xl text-white">DDCRM</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 mt-5 space-y-2">
        {LeftSideMenuData.map((el) => {
          const isActive =
            el.name.toLocaleLowerCase() === activeLink ||
            (activeLink === "" && el.name === "Dashboard");

          return (
            <div className="relative group" key={el.name}>
              <Link
                to={el.link}
                className={`flex items-center justify-start gap-2 p-3 h-12 max-h-12 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#D1E9FF] text-[#0A66C2] font-semibold"
                    : "text-white hover:bg-[#004080]"
                }`}
              >
                <span>{el.icons}</span>
                {!isCollapsed && (
                  <div className="relative h-12 my-auto w-34 overflow-hidden">
                    <span className="text-sm font-medium">{el.name}</span>
                  </div>
                )}
              </Link>
              {isCollapsed && (
                <span className="absolute z-50 left-full top-1/2 transform -translate-y-1/2 ml-2 whitespace-nowrap bg-[#004080] text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {el.name}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto flex justify-center">
        <div className="w-[90%]">
          <Button
            size="sm"
            onClick={signOut}
            className={`flex items-center justify-center gap-2 w-full rounded-lg border border-[#F1F1F1] text-white bg-[#004080] hover:text-white transition-all duration-300 ${
              isCollapsed ? "justify-center" : "p-3"
            }`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LeftSectionsDashboard;
