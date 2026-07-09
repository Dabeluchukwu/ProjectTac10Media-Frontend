import api from "./axios";

// ============================================
// Platform Stats (Super Admin)
// ============================================

/**
 * Get platform-wide statistics
 * @returns {Promise} Platform stats including users, courses, bookings, revenue
 */
export const getPlatformStats = async () => {
  const response = await api.get("/dashboard/platform");
  return response.data.data;
};

/**
 * Get platform analytics with charts data
 * @param {Object} params - { period: 'day'|'week'|'month'|'year' }
 */
export const getPlatformAnalytics = async (params = {}) => {
  const response = await api.get("/dashboard/platform/analytics", { params });
  return response.data.data;
};

/**
 * Get platform revenue breakdown
 * @param {Object} params - { period: 'week'|'month'|'year' }
 */
export const getPlatformRevenue = async (params = {}) => {
  const response = await api.get("/dashboard/platform/revenue", { params });
  return response.data.data;
};

/**
 * Get platform settings
 */
export const getPlatformSettings = async () => {
  const response = await api.get("/dashboard/platform/settings");
  return response.data.data;
};

/**
 * Update platform settings
 */
export const updatePlatformSettings = async (data) => {
  const response = await api.put("/dashboard/platform/settings", data);
  return response.data.data;
};

// ============================================
// Admin Stats
// ============================================

/**
 * Get admin dashboard stats
 */
export const getAdminStats = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data.data;
};

/**
 * Get admin analytics
 */
export const getAdminAnalytics = async (params = {}) => {
  const response = await api.get("/dashboard/admin/analytics", { params });
  return response.data.data;
};

// ============================================
// Instructor Stats
// ============================================

/**
 * Get instructor dashboard stats
 */
export const getInstructorStats = async () => {
  const response = await api.get("/dashboard/instructor");
  return response.data.data;
};

/**
 * Get instructor analytics
 */
export const getInstructorAnalytics = async (params = {}) => {
  const response = await api.get("/dashboard/instructor/analytics", { params });
  return response.data.data;
};

// ============================================
// Student Stats
// ============================================

/**
 * Get student dashboard stats
 */
export const getStudentStats = async () => {
  const response = await api.get("/dashboard/student");
  return response.data.data;
};

/**
 * Get student progress data
 */
export const getStudentProgress = async () => {
  const response = await api.get("/dashboard/student/progress");
  return response.data.data;
};

// ============================================
// Client Stats
// ============================================

/**
 * Get client dashboard stats
 */
export const getClientStats = async () => {
  const response = await api.get("/dashboard/client");
  return response.data.data;
};

/**
 * Get client bookings analytics
 */
export const getClientAnalytics = async (params = {}) => {
  const response = await api.get("/dashboard/client/analytics", { params });
  return response.data.data;
};

// ============================================
// Chart Data Utilities
// ============================================

/**
 * Get data for revenue chart
 */
export const getRevenueChartData = async (period = "month") => {
  const response = await api.get("/dashboard/charts/revenue", {
    params: { period },
  });
  return response.data.data;
};

/**
 * Get data for user growth chart
 */
export const getUserGrowthChart = async (period = "month") => {
  const response = await api.get("/dashboard/charts/users", {
    params: { period },
  });
  return response.data.data;
};

/**
 * Get data for course enrollment chart
 */
export const getEnrollmentChart = async (period = "month") => {
  const response = await api.get("/dashboard/charts/enrollments", {
    params: { period },
  });
  return response.data.data;
};

/**
 * Get data for booking chart
 */
export const getBookingChart = async (period = "month") => {
  try {
    const response = await api.get("/dashboard/charts/bookings", {
      params: { period },
    });
    console.log("📊 Booking chart API response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Booking chart API error:", error.response?.data || error.message);
    throw error;
  }
};


