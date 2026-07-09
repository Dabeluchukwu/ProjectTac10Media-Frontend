import { useEnrollmentChart } from "../../../hooks/useDashboard";

const EnrollmentChart = ({ period = "month" }) => {
  const { data, isLoading } = useEnrollmentChart(period);

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

  const chartData = data || [];
  const maxEnrollments = Math.max(...(chartData.map(d => d.count) || [0]), 1);
  const totalEnrollments = chartData.reduce((sum, d) => sum + d.count, 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Course Enrollments</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          No enrollment data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold mb-4">Course Enrollments</h3>
      <div className="h-48 flex items-end gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-green-500 rounded-t transition-all hover:bg-green-400"
              style={{
                height: `${(item.count / maxEnrollments) * 100}%`,
                minHeight: item.count > 0 ? "8px" : "0px",
              }}
            ></div>
            <span className="text-xs text-gray-400 mt-1">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-400">
        <span>Total: {totalEnrollments} enrollments</span>
        <span>{period}</span>
      </div>
    </div>
  );
};

export default EnrollmentChart;