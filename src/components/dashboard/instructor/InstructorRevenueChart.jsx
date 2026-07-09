import { useQuery } from "@tanstack/react-query";
import { getInstructorAnalytics } from "../../../api/dashboardApi";

const InstructorRevenueChart = ({ period = "month" }) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["instructor-analytics", period],
    queryFn: () => getInstructorAnalytics({ period }),
  });

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  const revenueData = analytics?.revenue || [];
  const maxRevenue = Math.max(...(revenueData.map(d => d.amount) || [0]), 1);
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.amount, 0);

  if (revenueData.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          No revenue data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
      <div className="h-48 flex items-end gap-2">
        {revenueData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-amber-500 rounded-t transition-all hover:bg-amber-400"
              style={{
                height: `${(item.amount / maxRevenue) * 100}%`,
                minHeight: item.amount > 0 ? "8px" : "0px",
              }}
            ></div>
            <span className="text-xs text-gray-400 mt-1">{item.date}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-400">
        <span>Total: ₦{totalRevenue.toLocaleString()}</span>
        <span>{period}</span>
      </div>
    </div>
  );
};

export default InstructorRevenueChart;