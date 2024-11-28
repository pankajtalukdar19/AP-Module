import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useAppSelector } from "@/hooks/reduxHook";
import { menuConfig } from "@/config/menu.config";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/config";
import { Image } from "primereact/image";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [visible, setVisible] = useState(false);

  const firstletter = (str: any) => {
    return str?.charAt(0);
  };

  const navigate = useNavigate();
  const { logout } = useAuth();
  // Get menu items based on user role
  const menuItems = user?.role
    ? menuConfig[user.role as keyof typeof menuConfig]
    : [];

  const sidebarContent = (
    <>
      <div className="sidebar-main">
        <div className="navbar-top">
          <div
            className="sidebar-header"
            onClick={() => {
              setVisible(false);
              navigate("/");
            }}
          >
            <div className="logo-container">
              <i className="pi pi-prime text-4xl text-primary"></i>
              <span className="app-name">AP-module</span>
            </div>
          </div>

          <div className="sidebar-content">
            <nav className="sidebar-menu">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    setVisible(false);
                  }} // Close sidebar on mobile when link is clicked
                  className={({ isActive }) =>
                    classNames("menu-item", {
                      active: isActive,
                    })
                  }
                >
                  <i className={classNames(item.icon, "menu-icon")} />
                  <span className="menu-label">{item.label}</span>
                </NavLink>
              ))}
              {isCollapsed && (
                <a href="" className="menu-item">
                  <i className=" menu-icon pi pi-power-off" />
                </a>
              )}
            </nav>
          </div>
        </div>
        <div className="sidebar-action">
          <div className="profile-body">
            <div
              className="profile-avatar"
              onClick={() =>
                user && user?.role !== "admin" && navigate("/profile")
              }
            >
              {firstletter(user?.name)}
            </div>

            {!isCollapsed && (
              <div
                onClick={() =>
                  user && user?.role !== "admin" && navigate("/profile")
                }
              >
                <span>{user?.name}</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="logout-body" onClick={() => logout()}>
              <i className="pi pi-power-off"></i>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger button for mobile */}
      <Button
        icon="pi pi-bars"
        onClick={() => setVisible(true)}
        className="hamburger-button"
        aria-label="Menu"
      />

      {/* Mobile Sidebar */}
      <PrimeSidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className="mobile-sidebar"
        position="left"
      >
        {sidebarContent}
      </PrimeSidebar>

      {/* Desktop Sidebar */}
      <aside
        className={classNames("desktop-sidebar", { collapsed: isCollapsed })}
      >
        {sidebarContent}
        <Button
          icon={isCollapsed ? "pi pi-angle-right" : "pi pi-angle-left"}
          rounded
          text
          severity="secondary"
          onClick={() => onCollapse(!isCollapsed)}
          className="sidebar-toggle"
        />
      </aside>
    </>
  );
}

export default Sidebar;
