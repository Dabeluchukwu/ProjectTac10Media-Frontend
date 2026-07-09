// import { Outlet, NavLink } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const InstructorLayout = () => {
//   const { user, logout } = useAuthStore();

//   const navItems = [
//     { to: "/instructor/dashboard", label: "Dashboard", icon: "📊" },
//     { to: "/instructor/courses", label: "My Courses", icon: "📚" },
//     { to: "/instructor/students", label: "Students", icon: "👨‍🎓" },
//     { to: "/instructor/analytics", label: "Analytics", icon: "📈" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#0b0b0b] text-white flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-amber-400">Instructor</h1>
//           <p className="text-sm text-gray-400">{user?.firstName} {user?.lastName}</p>
//         </div>

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

//         <button
//           onClick={logout}
//           className="mt-4 px-4 py-3 text-left text-red-400 hover:bg-red-400/10 rounded-lg transition"
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
import { Home } from "lucide-react";
import useAuthStore from "../store/authStore";
import ProfileDropdown from "../components/common/ProfileDropdown";

const InstructorLayout = () => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { to: "/instructor/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/instructor/courses", label: "My Courses", icon: "📚" },
    { to: "/instructor/students", label: "Students", icon: "👨‍🎓" },
    { to: "/instructor/analytics", label: "Analytics", icon: "📈" },
      { to: "/instructor/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
        <Link to="/" className="mb-4">
          <h1 className="text-2xl font-bold text-amber-400">Instructor</h1>
          <p className="text-sm text-gray-400">{user?.firstName} {user?.lastName}</p>
        </Link>

        <Link
          to="/"
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
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;