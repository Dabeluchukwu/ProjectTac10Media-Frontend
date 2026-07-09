import { useState } from "react";
import { usePlatformAnalytics } from "../../hooks/useDashboard";

const SuperAdminAnalytics = () => {
  const [period, setPeriod] = useState("month");

  const { data, isLoading } = usePlatformAnalytics({ period });

  if (isLoading) {
    return <div className="text-gray-400">Loading analytics...</div>;
  }

  const metrics = [
    { label: "Total Views", value: data?.totalViews?.toLocaleString() || 0, icon: "👁️" },
    { label: "Unique Visitors", value: data?.uniqueVisitors?.toLocaleString() || 0, icon: "👤" },
    { label: "Avg. Session Duration", value: data?.avgSessionDuration || "0m", icon: "⏱️" },
    { label: "Bounce Rate", value: data?.bounceRate || "0%", icon: "📉" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <div className="text-3xl mb-2">{metric.icon}</div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-gray-400">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Courses</h3>
          <div className="space-y-3">
            {data?.topCourses?.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">#{index + 1}</span>
                  <span className="font-medium">{course.title}</span>
                </div>
                <span className="text-sm text-gray-400">{course.enrollments} enrollments</span>
              </div>
            ))}
            {(!data?.topCourses || data.topCourses.length === 0) && (
              <p className="text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Instructors</h3>
          <div className="space-y-3">
            {data?.topInstructors?.map((instructor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">#{index + 1}</span>
                  <span className="font-medium">{instructor.name}</span>
                </div>
                <span className="text-sm text-gray-400">{instructor.courses} courses</span>
              </div>
            ))}
            {(!data?.topInstructors || data.topInstructors.length === 0) && (
              <p className="text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAnalytics;