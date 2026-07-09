import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getAllCourses, updateCourseStatus, deleteCourse } from "../../../api/courseApi";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

const AdminCourses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAllCourses,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ courseId, status }) => updateCourseStatus(courseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-courses"]);
      toast.success("Course status updated");
    },
    onError: () => {
      toast.error("Failed to update course");
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-courses"]);
      toast.success("Course deleted");
    },
    onError: () => {
      toast.error("Failed to delete course");
    },
  });

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage all courses on the platform
          </p>
        </div>
        <div className="flex gap-3">
          <span className="text-sm text-gray-400 self-center">
            Total: {courses?.length || 0} courses
          </span>
          {/* ✅ Add Create Course Button */}
          <button
            onClick={() => navigate("/admin/courses/create")}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Create Course
          </button>
        </div>
      </div>

      {courses?.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-400 text-lg">No courses found</p>
          <p className="text-gray-500 text-sm mt-2">
            Get started by creating your first course
          </p>
          <button
            onClick={() => navigate("/admin/courses/create")}
            className="mt-4 bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Course</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Instructor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((course) => (
                  <tr key={course._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {course.image && (
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        {!course.image && (
                          <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center text-2xl">
                            📚
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-xs text-gray-400">{course.modules?.length || 0} modules</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {formatCurrency(course.price)}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.isPublished 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updateStatusMutation.mutate({
                              courseId: course._id,
                              status: !course.isPublished,
                            });
                          }}
                          className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                            course.isPublished 
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" 
                              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          }`}
                          title={course.isPublished ? "Unpublish" : "Publish"}
                        >
                          {course.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                          {course.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        
                        <Link
                          to={`/admin/courses/${course._id}/edit`}
                          className="px-2 py-1 rounded text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                        
                        <Link
                          to={`/courses/${course._id}`}
                          target="_blank"
                          className="px-2 py-1 rounded text-sm bg-neutral-700 text-gray-300 hover:bg-neutral-600 flex items-center gap-1"
                        >
                          View
                        </Link>
                        
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${course.title}"? This cannot be undone.`)) {
                              deleteCourseMutation.mutate(course._id);
                            }
                          }}
                          className="px-2 py-1 rounded text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
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

export default AdminCourses;