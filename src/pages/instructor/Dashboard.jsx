// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { getInstructorStats } from "../../api/courseApi";

// const InstructorDashboard = () => {
//   const { data: stats, isLoading } = useQuery({
//     queryKey: ["instructor-stats"],
//     queryFn: getInstructorStats,
//   });

//   if (isLoading) {
//     return <div className="text-gray-400">Loading...</div>;
//   }

//   const statCards = [
//     { label: "Total Courses", value: stats?.totalCourses || 0, icon: "📚", color: "bg-blue-500/20 text-blue-400" },
//     { label: "Total Students", value: stats?.totalStudents || 0, icon: "👨‍🎓", color: "bg-green-500/20 text-green-400" },
//     { label: "Total Revenue", value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`, icon: "💰", color: "bg-amber-500/20 text-amber-400" },
//     { label: "Pending Reviews", value: stats?.pendingReviews || 0, icon: "⭐", color: "bg-purple-500/20 text-purple-400" },
//   ];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <Link
//           to="/instructor/courses/new"
//           className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
//         >
//           + Create New Course
//         </Link>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statCards.map((stat) => (
//           <div key={stat.label} className={`${stat.color} p-6 rounded-xl border border-neutral-800`}>
//             <div className="text-3xl mb-2">{stat.icon}</div>
//             <p className="text-2xl font-bold">{stat.value}</p>
//             <p className="text-sm opacity-80">{stat.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//         <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Link
//             to="/instructor/courses/new"
//             className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
//           >
//             <div className="text-2xl mb-2">📝</div>
//             <p className="font-medium">Create Course</p>
//             <p className="text-sm text-gray-400">Add a new course</p>
//           </Link>
//           <Link
//             to="/instructor/courses"
//             className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
//           >
//             <div className="text-2xl mb-2">📚</div>
//             <p className="font-medium">Manage Courses</p>
//             <p className="text-sm text-gray-400">Edit or update courses</p>
//           </Link>
//           <Link
//             to="/instructor/students"
//             className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
//           >
//             <div className="text-2xl mb-2">👨‍🎓</div>
//             <p className="font-medium">View Students</p>
//             <p className="text-sm text-gray-400">See enrolled students</p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstructorDashboard;


import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getInstructorStats } from "../../api/courseApi";

const InstructorDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["instructor-stats"],
    queryFn: getInstructorStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="h-8 bg-neutral-800 rounded w-40 animate-pulse"></div>
          <div className="h-12 bg-neutral-800 rounded w-48 animate-pulse"></div>
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
    { label: "Total Courses", value: stats?.totalCourses || 0, icon: "📚", color: "bg-blue-500/20 text-blue-400" },
    { label: "Total Students", value: stats?.totalStudents || 0, icon: "👨‍🎓", color: "bg-green-500/20 text-green-400" },
    { label: "Total Revenue", value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`, icon: "💰", color: "bg-amber-500/20 text-amber-400" },
    { label: "Pending Reviews", value: stats?.pendingReviews || 0, icon: "⭐", color: "bg-purple-500/20 text-purple-400" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <Link
          to="/instructor/courses/new"
          className="w-full sm:w-auto bg-amber-500 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-amber-600 transition text-center text-sm sm:text-base"
        >
          + Create New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${stat.color} p-4 sm:p-6 rounded-xl border border-neutral-800`}>
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{stat.icon}</div>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            <p className="text-xs sm:text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link
            to="/instructor/courses/new"
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="font-medium text-sm sm:text-base">Create Course</p>
            <p className="text-xs sm:text-sm text-gray-400">Add a new course</p>
          </Link>
          <Link
            to="/instructor/courses"
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
          >
            <div className="text-2xl mb-2">📚</div>
            <p className="font-medium text-sm sm:text-base">Manage Courses</p>
            <p className="text-xs sm:text-sm text-gray-400">Edit or update courses</p>
          </Link>
          <Link
            to="/instructor/students"
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center sm:col-span-2 lg:col-span-1"
          >
            <div className="text-2xl mb-2">👨‍🎓</div>
            <p className="font-medium text-sm sm:text-base">View Students</p>
            <p className="text-xs sm:text-sm text-gray-400">See enrolled students</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;