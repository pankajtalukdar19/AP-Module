import { Outlet, useLocation } from "react-router-dom";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { classNames } from "primereact/utils";
import { menuConfig } from "@/config/menu.config";

function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    // Combine all menu items from user, vendor, and admin
    const allMenuItems = [...menuConfig.vendor, ...menuConfig.admin];

    // Find matching route and return its label
    const matchingRoute = allMenuItems.find(
      (item) => item.to === location.pathname
    );
    return matchingRoute?.label || "Dashboard";
  };

  return (
    <div className="layout-wrapper">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapse={setIsSidebarCollapsed}
      />
      <div
        className={classNames("layout-content", {
          "sidebar-collapsed": isSidebarCollapsed,
        })}
      >
        <div className="layout-topbar">
          <div className="topbar-left">
            <h2 className="page-title">{getPageTitle()}</h2>
          </div>
          <div className="topbar-right"></div>
        </div>
        <div className="layout-main">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
