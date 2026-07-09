// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { getPlatformStats } from "../../api/dashboardApi";
// import StatCard from "../../components/dashboard/admin/StatCard";
// import RevenueChart from "../../components/dashboard/admin/RevenueChart";
// import UserGrowthChart from "../../components/dashboard/admin/UserGrowthChart";
// import EnrollmentChart from "../../components/dashboard/admin/EnrollmentChart";
// import BookingChart from "../../components/dashboard/admin/BookingChart";
// import RecentActivity from "../../components/dashboard/admin/RecentActivity";

// const SuperAdminDashboard = () => {
//   const [period, setPeriod] = useState("month");

//   const { data: stats, isLoading } = useQuery({
//     queryKey: ["platform-stats"],
//     queryFn: getPlatformStats,
//   });

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="bg-neutral-900 rounded-xl p-6 animate-pulse">
//               <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4"></div>
//               <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="bg-neutral-900 rounded-xl p-6 animate-pulse">
//               <div className="h-48 bg-neutral-700 rounded"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const statCards = [
//     { 
//       label: "Total Users", 
//       value: stats?.totalUsers || 0, 
//       icon: "👥", 
//       color: "bg-blue-500/20 text-blue-400" 
//     },
//     { 
//       label: "Total Courses", 
//       value: stats?.totalCourses || 0, 
//       icon: "📚", 
//       color: "bg-green-500/20 text-green-400" 
//     },
//     { 
//       label: "Total Bookings", 
//       value: stats?.totalBookings || 0, 
//       icon: "📅", 
//       color: "bg-purple-500/20 text-purple-400" 
//     },
//     { 
//       label: "Total Revenue", 
//       value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`, 
//       icon: "💰", 
//       color: "bg-amber-500/20 text-amber-400" 
//     },
//     { 
//       label: "Students", 
//       value: stats?.students || 0, 
//       icon: "👨‍🎓", 
//       color: "bg-cyan-500/20 text-cyan-400" 
//     },
//     { 
//       label: "Instructors", 
//       value: stats?.instructors || 0, 
//       icon: "👨‍🏫", 
//       color: "bg-indigo-500/20 text-indigo-400" 
//     },
//     { 
//       label: "Clients", 
//       value: stats?.clients || 0, 
//       icon: "💼", 
//       color: "bg-pink-500/20 text-pink-400" 
//     },
//     { 
//       label: "Admins", 
//       value: stats?.admins || 0, 
//       icon: "🛡️", 
//       color: "bg-red-500/20 text-red-400" 
//     },
//   ];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Platform Overview</h1>
//         <div className="flex gap-3">
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
//           >
//             <option value="day">Today</option>
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//             <option value="year">This Year</option>
//           </select>
//           <Link
//             to="/super-admin/users"
//             className="bg-neutral-800 hover:bg-neutral-700 px-6 py-2 rounded-lg transition flex items-center gap-2"
//           >
//             👥 Manage Users
//           </Link>
//           <Link
//             to="/super-admin/admins"
//             className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
//           >
//             + Create Admin
//           </Link>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statCards.map((stat) => (
//           <StatCard key={stat.label} {...stat} />
//         ))}
//       </div>

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <RevenueChart period={period} />
//         <UserGrowthChart period={period} />
//         <EnrollmentChart period={period} />
//         <BookingChart period={period} />
//       </div>

//       {/* Recent Activity & Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <RecentActivity activities={stats?.recentActivities || []} />
//         </div>
//         <div className="space-y-6">
//           <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//             <h3 className="font-semibold mb-3">👥 User Management</h3>
//             <p className="text-sm text-gray-400 mb-4">Create, edit, or delete users. Assign roles.</p>
//             <Link
//               to="/super-admin/users"
//               className="text-amber-400 hover:text-amber-300 text-sm font-medium"
//             >
//               Manage Users →
//             </Link>
//           </div>

//           <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//             <h3 className="font-semibold mb-3">🛡️ Admin Management</h3>
//             <p className="text-sm text-gray-400 mb-4">Create new admin accounts for platform management.</p>
//             <Link
//               to="/super-admin/admins"
//               className="text-amber-400 hover:text-amber-300 text-sm font-medium"
//             >
//               Manage Admins →
//             </Link>
//           </div>

//           <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//             <h3 className="font-semibold mb-3">⚙️ Platform Settings</h3>
//             <p className="text-sm text-gray-400 mb-4">Configure platform-wide settings and preferences.</p>
//             <Link
//               to="/super-admin/settings"
//               className="text-amber-400 hover:text-amber-300 text-sm font-medium"
//             >
//               Go to Settings →
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPlatformStats } from "../../api/dashboardApi";
import StatCard from "../../components/dashboard/admin/StatCard";
import RevenueChart from "../../components/dashboard/admin/RevenueChart";
import UserGrowthChart from "../../components/dashboard/admin/UserGrowthChart";
import EnrollmentChart from "../../components/dashboard/admin/EnrollmentChart";
import BookingChart from "../../components/dashboard/admin/BookingChart";
import RecentActivity from "../../components/dashboard/admin/RecentActivity";

const SuperAdminDashboard = () => {
  const [period, setPeriod] = useState("month");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="h-8 bg-neutral-800 rounded w-48 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-10 bg-neutral-800 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-neutral-800 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-neutral-800 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="h-40 sm:h-48 bg-neutral-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Users", 
      value: stats?.totalUsers || 0, 
      icon: "👥", 
      color: "bg-blue-500/20 text-blue-400" 
    },
    { 
      label: "Total Courses", 
      value: stats?.totalCourses || 0, 
      icon: "📚", 
      color: "bg-green-500/20 text-green-400" 
    },
    { 
      label: "Total Bookings", 
      value: stats?.totalBookings || 0, 
      icon: "📅", 
      color: "bg-purple-500/20 text-purple-400" 
    },
    { 
      label: "Total Revenue", 
      value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`, 
      icon: "💰", 
      color: "bg-amber-500/20 text-amber-400" 
    },
    { 
      label: "Students", 
      value: stats?.students || 0, 
      icon: "👨‍🎓", 
      color: "bg-cyan-500/20 text-cyan-400" 
    },
    { 
      label: "Instructors", 
      value: stats?.instructors || 0, 
      icon: "👨‍🏫", 
      color: "bg-indigo-500/20 text-indigo-400" 
    },
    { 
      label: "Clients", 
      value: stats?.clients || 0, 
      icon: "💼", 
      color: "bg-pink-500/20 text-pink-400" 
    },
    { 
      label: "Admins", 
      value: stats?.admins || 0, 
      icon: "🛡️", 
      color: "bg-red-500/20 text-red-400" 
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Platform Overview</h1>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex-1 sm:flex-none bg-neutral-800 border border-neutral-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-amber-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Link
            to="/super-admin/users"
            className="flex-1 sm:flex-none bg-neutral-800 hover:bg-neutral-700 px-4 sm:px-6 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            👥 Users
          </Link>
          <Link
            to="/super-admin/admins"
            className="flex-1 sm:flex-none bg-amber-500 text-black px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            + Create Admin
          </Link>
        </div>
      </div>

      {/* Stats Grid - 8 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <RevenueChart period={period} />
        <UserGrowthChart period={period} />
        <EnrollmentChart period={period} />
        <BookingChart period={period} />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={stats?.recentActivities || []} />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">👥 User Management</h3>
            <p className="text-sm text-gray-400 mb-4">Create, edit, or delete users. Assign roles.</p>
            <Link
              to="/super-admin/users"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Manage Users →
            </Link>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">🛡️ Admin Management</h3>
            <p className="text-sm text-gray-400 mb-4">Create new admin accounts for platform management.</p>
            <Link
              to="/super-admin/admins"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Manage Admins →
            </Link>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">⚙️ Platform Settings</h3>
            <p className="text-sm text-gray-400 mb-4">Configure platform-wide settings and preferences.</p>
            <Link
              to="/super-admin/settings"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Go to Settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;