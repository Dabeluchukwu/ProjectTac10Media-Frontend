import useProgress from "../../hooks/useProgress";
import useRegistrations from "../../hooks/useRegistrations";
import { useNavigate } from "react-router-dom";

const CourseProgress = () => {
  const navigate = useNavigate();
  const { registrations, loading: registrationsLoading } = useRegistrations();
  const { progress, loading } = useProgress(registrations);

  if (loading || registrationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-orange-400">My Progress</h1>
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <p className="text-gray-400 text-lg">
            You haven't started any courses yet.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-4 bg-amber-500 px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition text-black"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">My Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progress.map((item, index) => {
          const course = item.course || {};
          const percentage = item.progressPercentage || 0;
          const isCompleted = percentage === 100;
          const status = item.status || "not-started";

          return (
            <div
              key={index}
              className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 hover:border-amber-500/50 transition-all"
            >
              {/* Course Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {course.title || "Untitled Course"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {isCompleted
                      ? "🎉 Completed"
                      : `${status.replace("-", " ")}`}
                  </p>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isCompleted ? "text-green-400" : "text-amber-400"
                  }`}
                >
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-700 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isCompleted ? "bg-green-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  Lessons Completed: {item.completedLessons?.length || 0}
                </span>
                <span>
                  Status:{" "}
                  <span
                    className={
                      isCompleted
                        ? "text-green-400"
                        : status === "in-progress"
                          ? "text-amber-400"
                          : "text-gray-400"
                    }
                  >
                    {isCompleted ? "Completed" : status}
                  </span>
                </span>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => navigate(`/dashboard/learn/${item.course?._id}`)}
                className={`mt-4 w-full py-2 rounded-lg font-semibold transition ${
                  isCompleted
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-amber-500 text-black hover:bg-amber-600"
                }`}
              >
                {isCompleted ? "Review Course" : "Continue Learning"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseProgress;
