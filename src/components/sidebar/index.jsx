import { NavLink, useNavigate, Link } from "react-router-dom";
import { Home, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { sidebarConfig } from "../../config/sidebarConfig";
import ProfileDropdown from "../common/ProfileDropdown";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menu = sidebarConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-amber-500 rounded-lg text-black shadow-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-40
          w-64 h-screen bg-[#0b0b0b] text-white
          flex flex-col p-6 border-r border-neutral-800
          overflow-y-auto flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* BRAND */}
        <Link to="/" className="mb-4" onClick={closeSidebar}>
          <div className="mb-1">
            <h1 className="text-xl font-bold text-amber-400">TAC 10 MEDIA</h1>
          </div>
          <p className="text-sm text-gray-400">
            {user?.firstName} {user?.lastName}
          </p>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded mt-1 inline-block capitalize">
            {user?.role}
          </span>
        </Link>

        {/* GO TO SITE */}
        <Link
          to="/"
          onClick={closeSidebar}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition mb-4"
        >
          <Home size={18} />
          <span>Go to Site</span>
        </Link>

        <div className="border-t border-neutral-800 my-2"></div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    isActive
                      ? "bg-amber-500 text-black"
                      : "hover:bg-neutral-800 text-gray-300"
                  }
                `
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* USER SECTION */}
        <div className="border-t border-neutral-800 pt-4 mt-4">
          <ProfileDropdown variant="sidebar" />

          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-3 text-left text-red-400 hover:bg-red-400/10 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
