// import { NavLink, useNavigate } from "react-router-dom";

// import useAuthStore from "../../store/authStore";

// import { sidebarConfig } from "../../config/sidebarConfig";

// const Sidebar = () => {
//   const user = useAuthStore((state) => state.user);

//   const logout = useAuthStore((state) => state.logout);

//   const navigate = useNavigate();

//   const menu = sidebarConfig[user?.role] || [];

//   const handleLogout = () => {
//     logout();

//     navigate("/login");
//   };

//   return (
//     <aside
//       className="
//       w-64
//       min-h-screen
//       bg-black
//       text-white
//       flex
//       flex-col
//       p-5
//       "
//     >
//       {/* BRAND */}

//       <div className="mb-8">
//         <h2 className="text-2xl font-bold">TAC 10 MEDIA</h2>

//         <p className="text-sm text-gray-400 mt-1">{user?.role}</p>
//       </div>

//       {/* NAVIGATION */}

//       <nav className="space-y-2 flex-1">
//         {menu.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `
//                 block
//                 px-4
//                 py-3
//                 rounded-lg
//                 transition

//                 ${
//                   isActive
//                     ? "bg-white text-black font-semibold"
//                     : "hover:bg-gray-800 text-gray-300"
//                 }

//                 `
//             }
//           >
//             {item.name}
//           </NavLink>
//         ))}
//       </nav>

//       {/* USER SECTION */}

//       <div className="border-t border-gray-700 pt-4">
//         <div className="mb-4">
//           <p className="font-semibold">
//             {user?.firstName} {user?.lastName}
//           </p>

//           <p className="text-sm text-gray-400">{user?.email}</p>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="
//           w-full
//           bg-red-600
//           hover:bg-red-700
//           py-2
//           rounded-lg
//           transition
//           "
//         >
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import { NavLink, useNavigate, Link } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { sidebarConfig } from "../../config/sidebarConfig";
import ProfileDropdown from "../common/ProfileDropdown";

const sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const menu = sidebarConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#0b0b0b] text-white flex flex-col p-6 border-r border-neutral-800 overflow-y-auto flex-shrink-0">
      {/* BRAND */}
      <Link to="/" className="mb-4">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-amber-400">TAC 10 MEDIA</h1>
        </div>
        <p className="text-sm text-gray-400">{user?.firstName} {user?.lastName}</p>
        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded mt-1 inline-block capitalize">
          {user?.role}
        </span>
      </Link>

      {/* GO TO SITE */}
      <Link
        to="/"
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
  );
};

export default sidebar;