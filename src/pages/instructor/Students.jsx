import { useQuery } from "@tanstack/react-query";
import { getInstructorStudents } from "../../api/courseApi";

const InstructorStudents = () => {
  const { data: students, isLoading, error } = useQuery({
    queryKey: ["instructor-students"],
    queryFn: getInstructorStudents,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching students:", error);
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400">Failed to load students</p>
        <p className="text-sm text-gray-400 mt-1">{error?.message || "Please try again"}</p>
      </div>
    );
  }

  const studentsArray = Array.isArray(students) ? students : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-gray-400 text-sm mt-1">
            Students enrolled in your courses
          </p>
        </div>
        <span className="text-sm bg-neutral-800 px-4 py-2 rounded-lg">
          Total: {studentsArray.length} students
        </span>
      </div>

      {studentsArray.length === 0 ? (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <div className="text-6xl mb-4">👨‍🎓</div>
          <h3 className="text-xl font-semibold mb-2">No students yet</h3>
          <p className="text-gray-400">Students will appear here once they enroll in your courses.</p>
          <Link
            to="/instructor/courses"
            className="mt-4 inline-block bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            View My Courses
          </Link>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Student</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Phone</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Courses</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {studentsArray.map((student) => (
                  <tr key={student._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-lg font-semibold text-white">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{student.firstName} {student.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{student.email}</td>
                    <td className="p-4 text-sm text-gray-300">{student.phone || "—"}</td>
                    <td className="p-4 text-sm text-gray-300">
                      {student.courses?.map((c) => c.courseTitle).join(", ") || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;