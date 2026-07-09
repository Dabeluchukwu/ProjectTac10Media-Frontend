// import { Outlet, NavLink, Link } from "react-router-dom";
// import { Home } from "lucide-react";
// import useAuthStore from "../store/authStore";
// import ProfileDropdown from "../components/common/ProfileDropdown";

// const InstructorLayout = () => {
//   const { user, logout } = useAuthStore();

//   const navItems = [
//     { to: "/instructor/dashboard", label: "Dashboard", icon: "📊" },
//     { to: "/instructor/courses", label: "My Courses", icon: "📚" },
//     { to: "/instructor/students", label: "Students", icon: "👨‍🎓" },
//     { to: "/instructor/analytics", label: "Analytics", icon: "📈" },
//       { to: "/instructor/profile", label: "Profile", icon: "👤" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#0b0b0b] text-white flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
//         <Link to="/" className="mb-4">
//           <h1 className="text-2xl font-bold text-amber-400">Instructor</h1>
//           <p className="text-sm text-gray-400">{user?.firstName} {user?.lastName}</p>
//         </Link>

//         <Link
//           to="/"
//           className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition mb-4"
//         >
//           <Home size={18} />
//           <span>Go to Site</span>
//         </Link>

//         <div className="border-t border-neutral-800 my-2"></div>

//         <nav className="flex-1 space-y-2">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               className={({ isActive }) => `
//                 flex items-center gap-3 px-4 py-3 rounded-lg transition
//                 ${isActive 
//                   ? "bg-amber-500 text-black" 
//                   : "hover:bg-neutral-800 text-gray-300"
//                 }
//               `}
//             >
//               <span>{item.icon}</span>
//               <span>{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         <div className="border-t border-neutral-800 pt-4 mt-4">
//           <ProfileDropdown variant="sidebar" />
//         </div>

//         <button
//           onClick={logout}
//           className="mt-3 px-4 py-3 text-left text-red-400 hover:bg-red-400/10 rounded-lg transition w-full"
//         >
//           🚪 Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto max-h-screen">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default InstructorLayout;



import { Outlet, NavLink, Link } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../store/authStore";
import ProfileDropdown from "../components/common/ProfileDropdown";

const InstructorLayout = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/instructor/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/instructor/courses", label: "My Courses", icon: "📚" },
    { to: "/instructor/students", label: "Students", icon: "👨‍🎓" },
    { to: "/instructor/analytics", label: "Analytics", icon: "📈" },
    { to: "/instructor/profile", label: "Profile", icon: "👤" },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">
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
          w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          min-h-screen
        `}
      >
        <Link to="/" className="mb-4" onClick={closeSidebar}>
          <h1 className="text-2xl font-bold text-amber-400">Instructor</h1>
          <p className="text-sm text-gray-400">{user?.firstName} {user?.lastName}</p>
        </Link>

        <Link
          to="/"
          onClick={closeSidebar}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition mb-4"
        >
          <Home size={18} />
          <span>Go to Site</span>
        </Link>

        <div className="border-t border-neutral-800 my-2"></div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${isActive 
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

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;