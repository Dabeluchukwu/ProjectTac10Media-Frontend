import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import useAuthStore from "../../store/authStore";

const ProfileDropdown = ({ variant = "navbar" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    const role = user?.role;
    if (role === "student" || role === "client") return "/dashboard";
    if (role === "instructor") return "/instructor/dashboard";
    if (role === "admin") return "/admin/dashboard";
    if (role === "superAdmin") return "/super-admin/dashboard";
    return "/dashboard";
  };

  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "?";
  };

  const getFullName = () => {
    if (!user) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  };

  if (!user) return null;

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-800 transition text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#d8a54a] flex items-center justify-center text-black font-semibold text-sm">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{getFullName()}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-[#111214] rounded-xl border border-[#2d2d2d] shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-[#2d2d2d]">
              <p className="text-sm font-medium text-white">{getFullName()}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <div className="p-1">
              <Link
                to={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm text-gray-300 transition"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              {/* <Link
                to="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm text-gray-300 transition"
              >
                <User size={16} />
                Profile
              </Link> */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm text-red-400 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Navbar variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 transition"
      >
        <div className="w-8 h-8 rounded-full bg-[#d8a54a] flex items-center justify-center text-black font-semibold text-sm">
          {getInitials()}
        </div>
        <span className="text-sm text-white hidden md:inline">{getFullName()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#111214] rounded-xl border border-[#2d2d2d] shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-[#2d2d2d]">
            <p className="text-sm font-medium text-white">{getFullName()}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <span className="text-xs bg-[#d8a54a]/20 text-[#d8a54a] px-2 py-0.5 rounded mt-1 inline-block">
              {user.role || "User"}
            </span>
          </div>
          <div className="p-1">
            <Link
              to={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm text-gray-300 transition"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            {/* <Link
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm text-gray-300 transition"
            >
              <User size={16} />
              Profile
            </Link> */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm text-red-400 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;