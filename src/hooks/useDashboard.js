import { useQuery } from "@tanstack/react-query";
import {
  getPlatformStats,
  getPlatformAnalytics,
  getPlatformRevenue,
  getPlatformSettings,
  updatePlatformSettings,
  getAdminStats,
  getAdminAnalytics,
  getInstructorStats,
  getInstructorAnalytics,
  getStudentStats,
  getStudentProgress,
  getClientStats,
  getClientAnalytics,
  getRevenueChartData,
  getUserGrowthChart,
  getEnrollmentChart,
  getBookingChart,
} from "../api/dashboardApi";

// ============================================
// Super Admin Hooks
// ============================================

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });
};

export const usePlatformAnalytics = (params) => {
  return useQuery({
    queryKey: ["platform-analytics", params],
    queryFn: () => getPlatformAnalytics(params),
    enabled: !!params?.period,
  });
};

export const usePlatformRevenue = (params) => {
  return useQuery({
    queryKey: ["platform-revenue", params],
    queryFn: () => getPlatformRevenue(params),
    enabled: !!params?.period,
  });
};

export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ["platform-settings"],
    queryFn: getPlatformSettings,
  });
};

export const useUpdatePlatformSettings = () => {
  return useMutation({
    mutationFn: updatePlatformSettings,
  });
};

// ============================================
// Admin Hooks
// ============================================

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });
};

export const useAdminAnalytics = (params) => {
  return useQuery({
    queryKey: ["admin-analytics", params],
    queryFn: () => getAdminAnalytics(params),
    enabled: !!params?.period,
  });
};

// ============================================
// Instructor Hooks
// ============================================

export const useInstructorStats = () => {
  return useQuery({
    queryKey: ["instructor-stats"],
    queryFn: getInstructorStats,
  });
};

export const useInstructorAnalytics = (params) => {
  return useQuery({
    queryKey: ["instructor-analytics", params],
    queryFn: () => getInstructorAnalytics(params),
    enabled: !!params?.period,
  });
};

// ============================================
// Student Hooks
// ============================================

export const useStudentStats = () => {
  return useQuery({
    queryKey: ["student-stats"],
    queryFn: getStudentStats,
  });
};

export const useStudentProgress = () => {
  return useQuery({
    queryKey: ["student-progress"],
    queryFn: getStudentProgress,
  });
};

// ============================================
// Client Hooks
// ============================================

export const useClientStats = () => {
  return useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientStats,
  });
};

export const useClientAnalytics = (params) => {
  return useQuery({
    queryKey: ["client-analytics", params],
    queryFn: () => getClientAnalytics(params),
    enabled: !!params?.period,
  });
};

// ============================================
// Chart Hooks
// ============================================

export const useRevenueChart = (period = "month") => {
  return useQuery({
    queryKey: ["revenue-chart", period],
    queryFn: async () => {
      const response = await getRevenueChartData(period);
      // ✅ Transform data to include label field
      const data = response?.data || response || [];
      return data.map((item) => ({
        label: item.date || item._id || "N/A",
        amount: item.amount || 0,
        date: item.date || item._id,
      }));
    },
    enabled: !!period,
  });
};

export const useUserGrowthChart = (period = "month") => {
  return useQuery({
    queryKey: ["user-growth-chart", period],
    queryFn: () => getUserGrowthChart(period),
  });
};

export const useEnrollmentChart = (period = "month") => {
  return useQuery({
    queryKey: ["enrollment-chart", period],
    queryFn: async () => {
      const response = await getEnrollmentChart(period);
      const data = response?.data || response || [];
      return data.map((item) => ({
        label: item.date || item._id || "N/A",
        count: item.count || 0,
        date: item.date || item._id,
      }));
    },
    enabled: !!period,
  });
};

export const useBookingChart = (period = "month") => {
  return useQuery({
    queryKey: ["booking-chart", period],
    queryFn: async () => {
      const response = await getBookingChart(period);
      const data = response?.data || response || [];
      return data.map((item) => ({
        label: item.date || item._id || "N/A",
        count: item.count || 0,
        date: item.date || item._id,
      }));
    },
    enabled: !!period,
  });
};