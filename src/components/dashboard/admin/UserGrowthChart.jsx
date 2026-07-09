import { useUserGrowthChart } from "../../../hooks/useDashboard";

const UserGrowthChart = ({ period = "month" }) => {
  const { data, isLoading } = useUserGrowthChart(period);

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

  const maxUsers = Math.max(...(data?.map(d => d.count) || [0]), 1);

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold mb-4">User Growth</h3>
      <div className="h-48 flex items-end gap-2">
        {data?.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-400"
              style={{
                height: `${(item.count / maxUsers) * 100}%`,
                minHeight: item.count > 0 ? "8px" : "0px",
              }}
            ></div>
            <span className="text-xs text-gray-400 mt-1">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-400">
        <span>Total: {data?.reduce((sum, d) => sum + d.count, 0) || 0} users</span>
        <span>{period}</span>
      </div>
    </div>
  );
};

export default UserGrowthChart;