import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getInstructorCourses } from "../../api/courseApi";

const Courses = () => {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  });

  if (isLoading) {
    return <div className="text-gray-400">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-red-400">Failed to load courses</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link
          to="/instructor/courses/new"
          className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          + New Course
        </Link>
      </div>

      {courses?.length === 0 ? (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
          <p className="text-gray-400 mb-6">Create your first course and start teaching!</p>
          <Link
            to="/instructor/courses/new"
            className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition inline-block"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition"
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    course.isPublished
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="text-sm text-gray-400">
                    ₦{course.price?.toLocaleString() || 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1 truncate">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{course.modules?.length || 0} Modules</span>
                  <span>{course.duration || "N/A"}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/instructor/courses/${course._id}/edit`}
                    className="flex-1 text-center bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/courses/${course._id}`}
                    target="_blank"
                    className="flex-1 text-center bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;