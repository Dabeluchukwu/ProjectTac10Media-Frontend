import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getInstructorStats } from "../../api/courseApi";

const InstructorDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["instructor-stats"],
    queryFn: getInstructorStats,
  });

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  const statCards = [
    { label: "Total Courses", value: stats?.totalCourses || 0, icon: "📚", color: "bg-blue-500/20 text-blue-400" },
    { label: "Total Students", value: stats?.totalStudents || 0, icon: "👨‍🎓", color: "bg-green-500/20 text-green-400" },
    { label: "Total Revenue", value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`, icon: "💰", color: "bg-amber-500/20 text-amber-400" },
    { label: "Pending Reviews", value: stats?.pendingReviews || 0, icon: "⭐", color: "bg-purple-500/20 text-purple-400" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          to="/instructor/courses/new"
          className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          + Create New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${stat.color} p-6 rounded-xl border border-neutral-800`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/instructor/courses/new"
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="font-medium">Create Course</p>
            <p className="text-sm text-gray-400">Add a new course</p>
          </Link>
          <Link
            to="/instructor/courses"
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
          >
            <div className="text-2xl mb-2">📚</div>
            <p className="font-medium">Manage Courses</p>
            <p className="text-sm text-gray-400">Edit or update courses</p>
          </Link>
          <Link
            to="/instructor/students"
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition text-center"
          >
            <div className="text-2xl mb-2">👨‍🎓</div>
            <p className="font-medium">View Students</p>
            <p className="text-sm text-gray-400">See enrolled students</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;