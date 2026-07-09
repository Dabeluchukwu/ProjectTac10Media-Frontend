import { useNavigate } from "react-router-dom";

const ProgressCard = ({ progress = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
                <div className="h-2 bg-neutral-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-white">Course Progress</h2>
        {progress.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/progress")}
            className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition"
          >
            View All
          </button>
        )}
      </div>

      {progress.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No course progress available.</p>
          <p className="text-sm text-gray-500 mt-1">Start learning to track your progress.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {progress.slice(0, 5).map((item) => {
            const percentage = item.progressPercentage ?? 0;
            const isCompleted = percentage === 100;

            return (
              <div key={item._id || item.course?._id || item.courseId}>
                <div className="flex flex-wrap justify-between items-center mb-1 gap-1">
                  <span className="text-sm font-medium text-white truncate max-w-[65%]">
                    {item.course?.title || "Unknown Course"}
                  </span>
                  <span className={`text-sm font-semibold ${isCompleted ? "text-green-400" : "text-amber-400"}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCompleted ? "bg-green-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {isCompleted && (
                  <p className="text-xs text-green-400 mt-1">✅ Completed</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {progress.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard/progress")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            +{progress.length - 5} more courses
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;