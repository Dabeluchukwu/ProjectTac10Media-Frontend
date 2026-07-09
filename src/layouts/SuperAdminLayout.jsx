import { Outlet, NavLink, Link } from "react-router-dom";
import { Home } from "lucide-react";
import useAuthStore from "../store/authStore";
import ProfileDropdown from "../components/common/ProfileDropdown";

const SuperAdminLayout = () => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { to: "/super-admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/super-admin/users", label: "Users", icon: "👥" },
    // { to: "/super-admin/roles", label: "Roles", icon: "🔑" },
    { to: "/super-admin/admins", label: "Admins", icon: "🛡️" },
    { to: "/super-admin/courses", label: "Courses", icon: "📚" },
    { to: "/super-admin/packages", label: "Packages", icon: "📦" },
    { to: "/super-admin/services", label: "Services", icon: "🔧" },
    { to: "/super-admin/bookings", label: "Bookings", icon: "📅" },
    { to: "/super-admin/jobs", label: "Jobs", icon: "💼" },
    { to: "/super-admin/payments", label: "Payments", icon: "💰" },
    { to: "/super-admin/profile", label: "Profile", icon: "👤" },
    // { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
    { to: "/super-admin/analytics", label: "Analytics", icon: "📈" },
    { to: "/super-admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">
      {/* ✅ Sidebar - Fixed */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col fixed h-screen overflow-y-auto">
        <Link to="/" className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👑</span>
            <h1 className="text-xl font-bold text-amber-400">Super Admin</h1>
          </div>
          <p className="text-sm text-gray-400">
            {user?.firstName} {user?.lastName}
          </p>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded mt-1 inline-block">
            Super Admin
          </span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition mb-4"
        >
          <Home size={18} />
          <span>Go to Site</span>
        </Link>

        <div className="border-t border-neutral-800 my-2"></div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-amber-500 text-black"
                    : "hover:bg-neutral-800 text-gray-300"
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-800 pt-4 mt-4">
          <ProfileDropdown variant="sidebar" />
        </div>

        <button
          onClick={logout}
          className="mt-3 px-4 py-3 text-left text-red-400 hover:bg-red-400/10 rounded-lg transition w-full"
        >
          🚪 Logout
        </button>
      </aside>

      {/* ✅ Main Content - Scrollable */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
