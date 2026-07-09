import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInstructorAnalytics } from "../../api/dashboardApi";
import InstructorRevenueChart from "../../components/dashboard/instructor/InstructorRevenueChart";
import InstructorEnrollmentChart from "../../components/dashboard/instructor/InstructorEnrollmentChart";

const InstructorAnalytics = () => {
  const [period, setPeriod] = useState("month");

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["instructor-analytics", period],
    queryFn: () => getInstructorAnalytics({ period }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from analytics data
  const totalStudents = analytics?.topCourses?.reduce((sum, course) => sum + course.students, 0) || 0;
  const totalCourses = analytics?.topCourses?.length || 0;
  const totalRevenue = analytics?.revenue?.reduce((sum, item) => sum + item.amount, 0) || 0;
  
  // Calculate average completion
  const avgCompletion = analytics?.topCourses?.length > 0
    ? Math.round(analytics.topCourses.reduce((sum, course) => sum + (course.completion || 0), 0) / analytics.topCourses.length)
    : 0;

  const metrics = [
    { label: "Total Students", value: totalStudents, icon: "👨‍🎓" },
    { label: "Total Courses", value: totalCourses, icon: "📚" },
    { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString() || 0}`, icon: "💰" },
    { label: "Avg. Completion", value: `${avgCompletion}%`, icon: "📈" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Overview of your course performance
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        >
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InstructorRevenueChart period={period} />
        <InstructorEnrollmentChart period={period} />
      </div>

      {/* Top Courses */}
      <div className="mt-6 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>
        <div className="space-y-3">
          {analytics?.topCourses?.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">#{index + 1}</span>
                <span className="font-medium">{course.title}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-400">{course.students} students</span>
                <span className="text-sm text-amber-400">{course.completion || 0}% complete</span>
              </div>
            </div>
          ))}
          {(!analytics?.topCourses || analytics.topCourses.length === 0) && (
            <p className="text-gray-400 text-center py-4">No course data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;