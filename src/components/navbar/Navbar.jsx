// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// const navLinks = [
//   { name: "Home", path: "/" },
//   { name: "About", path: "/about" },
//   { name: "Courses", path: "/courses" },
//   { name: "Services", path: "/services" },
//   { name: "Gallery", path: "/gallery" },
//   { name: "Careers", path: "/careers" },
//   { name: "Contact", path: "/contact" },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0D0D0D] border-b border-[#2d2d2d]">
//       <nav className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-10 flex items-center justify-between">
//         {/* LOGO */}
//         <NavLink
//           to="/"
//           onClick={closeMenu}
//           className="text-[#d8a54a] text-xl sm:text-2xl md:text-3xl lg:text-[38px] font-serif whitespace-nowrap"
//         >
//           TAC <span className="text-[#f1c46c]">10</span> MEDIA
//         </NavLink>

//         {/* DESKTOP NAV */}
//         <ul className="hidden lg:flex items-center gap-8 xl:gap-10">
//           {navLinks.map((link) => (
//             <li key={link.name}>
//               <NavLink
//                 to={link.path}
//                 className={({ isActive }) =>
//                   `relative text-[15px] font-medium transition ${
//                     isActive
//                       ? "text-[#d8a54a]"
//                       : "text-white hover:text-[#d8a54a]"
//                   }`
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {link.name}
//                     {isActive && (
//                       <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-10 h-[2px] bg-[#d8a54a]" />
//                     )}
//                   </>
//                 )}
//               </NavLink>
//             </li>
//           ))}
//         </ul>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-3">
//           {/* DESKTOP BUTTONS */}
//           <div className="hidden lg:flex items-center gap-4">
//             <NavLink
//               to="/login"
//               className="border border-[#3d3d3d] text-white px-6 py-2.5 rounded-md hover:border-[#d8a54a] hover:text-[#d8a54a] transition"
//             >
//               Login
//             </NavLink>

//             <NavLink
//               to="/register"
//               className="bg-[#d8a54a] text-black px-6 py-2.5 rounded-md font-semibold hover:bg-[#efbc5b] transition"
//             >
//               Register
//             </NavLink>
//           </div>

//           {/* MOBILE HAMBURGER (RIGHT EDGE) */}
//           <button
//             onClick={() => setMenuOpen(true)}
//             className="lg:hidden ml-auto text-white p-2"
//             aria-label="Open menu"
//           >
//             <Menu size={28} />
//           </button>
//         </div>
//       </nav>

//       {/* OVERLAY */}
//       <div
//         onClick={closeMenu}
//         className={`fixed inset-0 bg-black/60 transition-opacity duration-300 lg:hidden ${
//           menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       />

//       {/* SLIDE-IN DRAWER */}
//       <div
//         className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#111214] border-l border-[#2d2d2d] z-50 transform transition-transform duration-300 lg:hidden ${
//           menuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* TOP BAR */}
//         <div className="flex items-center justify-between px-5 h-20 border-b border-[#2d2d2d]">
//           <span className="text-[#d8a54a] font-serif text-lg">Menu</span>

//           <button
//             onClick={closeMenu}
//             className="text-white p-2"
//             aria-label="Close menu"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* LINKS */}
//         <div className="flex flex-col gap-6 p-6">
//           {navLinks.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.path}
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 `text-base transition ${
//                   isActive
//                     ? "text-[#d8a54a]"
//                     : "text-white hover:text-[#d8a54a]"
//                 }`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}

//           {/* BUTTONS */}
//           <div className="pt-6 flex flex-col gap-3">
//             <NavLink
//               to="/login"
//               onClick={closeMenu}
//               className="border border-[#3d3d3d] text-white rounded-md py-3 text-center hover:border-[#d8a54a]"
//             >
//               Login
//             </NavLink>

//             <NavLink
//               to="/register"
//               onClick={closeMenu}
//               className="bg-[#d8a54a] text-black rounded-md py-3 text-center font-semibold hover:bg-[#efbc5b]"
//             >
//               Register
//             </NavLink>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuthStore from "../../store/authStore";
import ProfileDropdown from "../common/ProfileDropdown";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Services", path: "/services" },
  { name: "Gallery", path: "/gallery" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const closeMenu = () => setMenuOpen(false);

  const getDashboardLink = () => {
    const role = user?.role;
    if (role === "student" || role === "client") return "/dashboard";
    if (role === "instructor") return "/instructor/dashboard";
    if (role === "admin") return "/admin/dashboard";
    if (role === "superAdmin") return "/super-admin/dashboard";
    return "/dashboard";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0D0D0D] border-b border-[#2d2d2d]">
      <nav className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* LOGO */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="text-[#d8a54a] text-xl sm:text-2xl md:text-3xl lg:text-[38px] font-serif whitespace-nowrap"
        >
          TAC <span className="text-[#f1c46c]">10</span> MEDIA
        </NavLink>

        {/* DESKTOP NAV */}
        <ul className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative text-[15px] font-medium transition ${
                    isActive
                      ? "text-[#d8a54a]"
                      : "text-white hover:text-[#d8a54a]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-10 h-[2px] bg-[#d8a54a]" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-white hover:text-[#d8a54a] transition text-sm"
                >
                  Dashboard
                </Link>
                <ProfileDropdown variant="navbar" />
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="border border-[#3d3d3d] text-white px-6 py-2.5 rounded-md hover:border-[#d8a54a] hover:text-[#d8a54a] transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-[#d8a54a] text-black px-6 py-2.5 rounded-md font-semibold hover:bg-[#efbc5b] transition"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER (RIGHT EDGE) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden ml-auto text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SLIDE-IN DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#111214] border-l border-[#2d2d2d] z-50 transform transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-[#2d2d2d]">
          <span className="text-[#d8a54a] font-serif text-lg">Menu</span>

          <button
            onClick={closeMenu}
            className="text-white p-2"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* LINKS */}
        <div className="flex flex-col gap-6 p-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `text-base transition ${
                  isActive
                    ? "text-[#d8a54a]"
                    : "text-white hover:text-[#d8a54a]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* BUTTONS */}
          <div className="pt-6 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={closeMenu}
                  className="bg-[#d8a54a] text-black rounded-md py-3 text-center font-semibold hover:bg-[#efbc5b]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  onClick={closeMenu}
                  className="border border-[#3d3d3d] text-white rounded-md py-3 text-center hover:border-[#d8a54a]"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    useAuthStore.getState().logout();
                    closeMenu();
                  }}
                  className="bg-red-600 text-white rounded-md py-3 text-center font-semibold hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="border border-[#3d3d3d] text-white rounded-md py-3 text-center hover:border-[#d8a54a]"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="bg-[#d8a54a] text-black rounded-md py-3 text-center font-semibold hover:bg-[#efbc5b]"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}