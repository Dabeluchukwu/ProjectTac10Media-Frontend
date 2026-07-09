// import { useQuery } from "@tanstack/react-query";
// import { getInstructorAnalytics } from "../../../api/dashboardApi";

// const InstructorEnrollmentChart = ({ period = "month" }) => {
//   const { data: analytics, isLoading } = useQuery({
//     queryKey: ["instructor-analytics", period],
//     queryFn: () => getInstructorAnalytics({ period }),
//   });

//   if (isLoading) {
//     return (
//       <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//         <div className="animate-pulse">
//           <div className="h-4 bg-neutral-700 rounded w-1/4 mb-4"></div>
//           <div className="h-48 bg-neutral-800 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   const enrollmentData = analytics?.enrollments || [];
//   const maxEnrollments = Math.max(...(enrollmentData.map(d => d.count) || [0]), 1);
//   const totalEnrollments = enrollmentData.reduce((sum, d) => sum + d.count, 0);

//   if (enrollmentData.length === 0) {
//     return (
//       <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//         <h3 className="text-lg font-semibold mb-4">Enrollment Overview</h3>
//         <div className="h-48 flex items-center justify-center text-gray-500">
//           No enrollment data available
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
//       <h3 className="text-lg font-semibold mb-4">Enrollment Overview</h3>
//       <div className="h-48 flex items-end gap-2">
//         {enrollmentData.map((item, index) => (
//           <div key={index} className="flex-1 flex flex-col items-center">
//             <div
//               className="w-full bg-green-500 rounded-t transition-all hover:bg-green-400"
//               style={{
//                 height: `${(item.count / maxEnrollments) * 100}%`,
//                 minHeight: item.count > 0 ? "8px" : "0px",
//               }}
//             ></div>
//             <span className="text-xs text-gray-400 mt-1">{item.date}</span>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-between mt-4 text-sm text-gray-400">
//         <span>Total: {totalEnrollments} enrollments</span>
//         <span>{period}</span>
//       </div>
//     </div>
//   );
// };

// export default InstructorEnrollmentChart;

import { useQuery } from "@tanstack/react-query";
import { getInstructorAnalytics } from "../../../api/dashboardApi";

const InstructorEnrollmentChart = ({ period = "month" }) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["instructor-analytics", period],
    queryFn: () => getInstructorAnalytics({ period }),
  });

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/4 mb-4"></div>
          <div className="h-40 sm:h-48 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  const enrollmentData = analytics?.enrollments || [];
  const maxEnrollments = Math.max(...(enrollmentData.map(d => d.count) || [0]), 1);
  const totalEnrollments = enrollmentData.reduce((sum, d) => sum + d.count, 0);

  if (enrollmentData.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Enrollment Overview</h3>
        <div className="h-40 sm:h-48 flex items-center justify-center text-gray-500 text-sm">
          No enrollment data available
        </div>
      </div>
    );
  }

  const displayData = enrollmentData;

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4">Enrollment Overview</h3>
      <div className="h-40 sm:h-48 flex items-end gap-1 sm:gap-2">
        {displayData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center min-w-0">
            <div
              className="w-full bg-green-500 rounded-t transition-all hover:bg-green-400"
              style={{
                height: `${(item.count / maxEnrollments) * 100}%`,
                minHeight: item.count > 0 ? "6px" : "0px",
              }}
            ></div>
            <span className="text-[8px] sm:text-xs text-gray-400 mt-1 truncate w-full text-center">
              {item.date}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-4 text-xs sm:text-sm text-gray-400 gap-1">
        <span>Total: {totalEnrollments} enrollments</span>
        <span className="capitalize">{period}</span>
      </div>
    </div>
  );
};

export default InstructorEnrollmentChart;