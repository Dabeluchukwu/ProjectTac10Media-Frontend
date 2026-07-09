import { useNavigate } from "react-router-dom";

const MyCoursesWidget = ({ registrations = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-white">My Courses</h2>
        {registrations.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition"
          >
            View All
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">You haven't enrolled in any courses yet.</p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-3 text-amber-400 hover:text-amber-300 text-sm transition"
          >
            Browse Courses →
          </button>
        </div>
      ) : (
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <div className="min-w-full inline-block align-middle px-4 sm:px-0">
            <div className="space-y-3">
              {registrations.slice(0, 5).map((item) => {
                const course = item.course || {};
                const status = item.paymentStatus || item.status || "Unknown";
                const statusColor = status === "paid" || status === "approved" 
                  ? "text-green-400" 
                  : status === "pending" 
                  ? "text-yellow-400" 
                  : "text-gray-400";

                return (
                  <div
                    key={item._id || course._id || item.courseId}
                    className="flex flex-wrap items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {course.title || "Untitled Course"}
                      </p>
                      <span className={`text-xs ${statusColor}`}>
                        {status}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const courseId = course._id || item.courseId;
                        if (courseId) navigate(`/dashboard/learn/${courseId}`);
                      }}
                      className="text-xs bg-amber-500 text-black px-3 py-1.5 rounded hover:bg-amber-600 transition whitespace-nowrap"
                    >
                      Continue
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {registrations.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            +{registrations.length - 5} more courses
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCoursesWidget;