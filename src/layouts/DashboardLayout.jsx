// import Sidebar from "../components/sideBar/SideBar";

// import { Outlet } from "react-router-dom";

// const DashboardLayout = () => {
//   return (
//     <div className="flex">

//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <Outlet />
//       </div>

//     </div>
//   );
// };

// export default DashboardLayout;

import Sidebar from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0b0b0b]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;