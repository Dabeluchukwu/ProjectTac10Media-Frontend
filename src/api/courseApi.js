import api from "./axios";

// Get all published courses
export const getCourses = () => {
  return api.get("/courses");
};

// Get single course
export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data.data; // Returns just the course data
};

// Get instructor's courses
export const getInstructorCourses = async () => {
  const response = await api.get("/courses/instructor");
  // ✅ Return the nested data
  return response.data.data;
};

// ✅ Get instructor stats -
export const getInstructorStats = async () => {
  const response = await api.get("/dashboard/instructor");
  return response.data.data;
};

// Create course
export const createCourse = async (data) => {
  const response = await api.post("/courses", data);
  return response.data.data;
};

// Update course
export const updateCourse = async (id, data) => {
  const response = await api.put(`/courses/${id}`, data);
  return response.data.data;
};

// ============================================
// Instructor Students
// ============================================

/**
 * Get instructor's students
 */
export const getInstructorStudents = async () => {
  const response = await api.get("/courses/instructor/students");
  return response.data.data;
};

/**
 * Get instructor analytics
 */
export const getInstructorAnalytics = async () => {
  const response = await api.get("/dashboard/instructor/analytics");
  return response.data.data;
};

/**
 * Get all courses (admin)
 */
export const getAllCourses = async () => {
  const response = await api.get("/courses/admin/all");
  return response.data.data;
};

/**
 * Update course status (admin)
 */
export const updateCourseStatus = async (courseId, status) => {
  const response = await api.patch(`/courses/${courseId}/status`, {
    isPublished: status,
  });
  return response.data.data;
};

/**
 * Delete course (admin)
 */
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data.data;
};
