// import StatCard from "../StatCard";

// import useRegistrations from "../../../hooks/useRegistrations";
// import usePayments from "../../../hooks/usePayments";
// import useProgress from "../../../hooks/useProgress";

// import MyCoursesWidget from "../MyCoursesWidget";
// import PaymentHistory from "../PaymentHistory";
// import ProgressCard from "../ProgressCard";

// const StudentView = () => {
//   const { registrations, loading: registrationsLoading } = useRegistrations();

//   const { payments, loading: paymentsLoading } = usePayments();

//   const { progress, loading: progressLoading } = useProgress(registrations);

//   const isLoading = registrationsLoading || paymentsLoading || progressLoading;

//   const totalPayments = payments
//     .filter((p) => p.status === "success")
//     .reduce((t, p) => t + p.amount, 0);

//  const averageProgress =
//   progress.length > 0
//     ? Math.round(
//         progress.reduce(
//           (total, item) => total + (item.progressPercentage || 0),
//           0
//         ) / progress.length
//       )
//     : 0;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard
//           title="My Courses"
//           value={isLoading ? "..." : registrations.length}
//         />

//         <StatCard
//           title="Payments"
//           value={isLoading ? "..." : `₦${totalPayments.toLocaleString()}`}
//         />

//         <StatCard
//           title="Progress"
//           value={isLoading ? "..." : `${averageProgress}%`}
//         />
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6 mt-8">
//         <MyCoursesWidget
//           registrations={registrations}
//           loading={registrationsLoading}
//         />

//         <PaymentHistory payments={payments} loading={paymentsLoading} />

//         <ProgressCard progress={progress} loading={progressLoading} />
//       </div>
//     </div>
//   );
// };

// export default StudentView;



import { useNavigate } from "react-router-dom";
import StatCard from "../StatCard";
import useRegistrations from "../../../hooks/useRegistrations";
import usePayments from "../../../hooks/usePayments";
import useProgress from "../../../hooks/useProgress";
import MyCoursesWidget from "../MyCoursesWidget";
import PaymentHistory from "../PaymentHistory";
import ProgressCard from "../ProgressCard";

const StudentView = () => {
  const navigate = useNavigate();
  const { registrations, loading: registrationsLoading } = useRegistrations();
  const { payments, loading: paymentsLoading } = usePayments();
  const { progress, loading: progressLoading } = useProgress(registrations);

  const isLoading = registrationsLoading || paymentsLoading || progressLoading;

  const totalPayments = payments
    .filter((p) => p.status === "success")
    .reduce((t, p) => t + p.amount, 0);

  const averageProgress =
    progress.length > 0
      ? Math.round(
          progress.reduce(
            (total, item) => total + (item.progressPercentage || 0),
            0
          ) / progress.length
        )
      : 0;

  const totalCourses = registrations.length;
  const completedCourses = progress.filter((p) => p.progressPercentage === 100).length || 0;
  const inProgressCourses = progress.filter((p) => p.progressPercentage > 0 && p.progressPercentage < 100).length || 0;

  const statCards = [
    {
      title: "Total Courses",
      value: isLoading ? "..." : totalCourses,
      icon: "📚",
      color: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/20" },
    },
    {
      title: "In Progress",
      value: isLoading ? "..." : inProgressCourses,
      icon: "📖",
      color: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/20" },
    },
    {
      title: "Completed",
      value: isLoading ? "..." : completedCourses,
      icon: "🎓",
      color: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/20" },
    },
    {
      title: "Avg Progress",
      value: isLoading ? "..." : `${averageProgress}%`,
      icon: "📈",
      color: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/20" },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h3 className="font-semibold mb-3">📚 Browse Courses</h3>
          <p className="text-sm text-gray-400 mb-4">Discover new courses to enhance your skills.</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Browse Courses
          </button>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h3 className="font-semibold mb-3">📖 Continue Learning</h3>
          <p className="text-sm text-gray-400 mb-4">Pick up where you left off in your courses.</p>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            My Courses
          </button>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h3 className="font-semibold mb-3">📊 Track Progress</h3>
          <p className="text-sm text-gray-400 mb-4">View your learning progress and achievements.</p>
          <button
            onClick={() => navigate("/dashboard/progress")}
            className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            View Progress
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MyCoursesWidget
          registrations={registrations}
          loading={registrationsLoading}
        />

        <PaymentHistory payments={payments} loading={paymentsLoading} />
      </div>

      <div className="grid lg:grid-cols-1 gap-6 mt-6">
        <ProgressCard progress={progress} loading={progressLoading} />
      </div>
    </div>
  );
};

export default StudentView;