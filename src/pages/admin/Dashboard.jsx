// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { getAdminStats } from "../../api/dashboardApi";
// import StatCard from "../../components/dashboard/admin/StatCard";
// import RevenueChart from "../../components/dashboard/admin/RevenueChart";
// import EnrollmentChart from "../../components/dashboard/admin/EnrollmentChart";
// import BookingChart from "../../components/dashboard/admin/BookingChart";
// import RecentActivity from "../../components/dashboard/admin/RecentActivity";

// const AdminDashboard = () => {
//   const [period, setPeriod] = useState("month");

//   const { data: stats, isLoading } = useQuery({
//     queryKey: ["admin-stats"],
//     queryFn: getAdminStats,
//   });

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="bg-neutral-900 rounded-xl p-6 animate-pulse">
//               <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4"></div>
//               <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
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
//   ];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
//         <EnrollmentChart period={period} />
//         <BookingChart period={period} />
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 gap-6">
//         <RecentActivity activities={stats?.recentActivities || []} />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../../api/dashboardApi";
import StatCard from "../../components/dashboard/admin/StatCard";
import RevenueChart from "../../components/dashboard/admin/RevenueChart";
import EnrollmentChart from "../../components/dashboard/admin/EnrollmentChart";
import BookingChart from "../../components/dashboard/admin/BookingChart";
import RecentActivity from "../../components/dashboard/admin/RecentActivity";

const AdminDashboard = () => {
  const [period, setPeriod] = useState("month");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="h-8 bg-neutral-800 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-neutral-800 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
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
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <div className="w-full sm:w-auto">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full sm:w-auto bg-neutral-800 border border-neutral-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-amber-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <RevenueChart period={period} />
        <EnrollmentChart period={period} />
        <BookingChart period={period} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <RecentActivity activities={stats?.recentActivities || []} />
      </div>
    </div>
  );
};

export default AdminDashboard;