
import { useQuery } from "@tanstack/react-query";
import { getMyRegistrations } from "../services/courseRegistrationService";
import useAuthStore from "../store/authStore";

const useRegistrations = () => {
  const user = useAuthStore((state) => state.user);
  
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      console.log("🔄 useRegistrations: Fetching registrations...");
      try {
        const registrations = await getMyRegistrations();
        console.log("📊 useRegistrations: Received:", registrations);
        return registrations || [];
      } catch (err) {
        console.error("❌ useRegistrations: Error:", err);
        // Return empty array on error so the app doesn't break
        return [];
      }
    },
    enabled: !!user, // Only fetch if user is logged in
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper to check if user is enrolled in a specific course
  const isEnrolled = (courseId) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log(`📊 isEnrolled(${courseId}): No registrations data`);
      return false;
    }
    
    const enrolled = data.some(
      (reg) => {
        const regCourseId = reg.course?._id || reg.courseId;
        return regCourseId === courseId;
      }
    );
    
    console.log(`📊 isEnrolled(${courseId}): ${enrolled}`);
    return enrolled;
  };

 // Get enrollment status for a course
const getEnrollmentStatus = (courseId) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log(`📊 getEnrollmentStatus(${courseId}): No registrations data`);
    return null;
  }
  
  const enrollment = data.find(
    (reg) => {
      const regCourseId = reg.course?._id || reg.courseId;
      return regCourseId === courseId;
    }
  );
  
  const status = enrollment ? enrollment.status : null;
  console.log(`📊 getEnrollmentStatus(${courseId}): ${status}`);
  return status;
};

// Get payment status for a course
const getPaymentStatus = (courseId) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log(`📊 getPaymentStatus(${courseId}): No registrations data`);
    return null;
  }
  
  const enrollment = data.find(
    (reg) => {
      const regCourseId = reg.course?._id || reg.courseId;
      return regCourseId === courseId;
    }
  );
  
  const paymentStatus = enrollment ? enrollment.paymentStatus || 'unpaid' : null;
  console.log(`📊 getPaymentStatus(${courseId}): ${paymentStatus}`);
  return paymentStatus;
};

// Check if payment is pending (based on paymentStatus only)
const isPendingPayment = (courseId) => {
  const paymentStatus = getPaymentStatus(courseId);
  // ✅ Only check paymentStatus, not the enrollment status
  const isPending = paymentStatus === 'pending' || paymentStatus === 'unpaid';
  console.log(`📊 isPendingPayment(${courseId}): ${isPending} (paymentStatus: ${paymentStatus})`);
  return isPending;
};


// Check if enrollment is active (can access course)
const isActiveEnrollment = (courseId) => {
  const status = getEnrollmentStatus(courseId);
  // ✅ Add 'approved' to the list of active statuses
  const isActive = status === 'active' || status === 'completed' || status === 'approved';
  console.log(`📊 isActiveEnrollment(${courseId}): ${isActive} (status: ${status})`);
  return isActive;
};
  // Check if enrollment is cancelled or expired
  const isCancelledOrExpired = (courseId) => {
    const status = getEnrollmentStatus(courseId);
    const isCancelled = status === 'cancelled' || status === 'expired';
    console.log(`📊 isCancelledOrExpired(${courseId}): ${isCancelled} (status: ${status})`);
    return isCancelled;
  };

  // Get full enrollment object for a course
  const getEnrollment = (courseId) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log(`📊 getEnrollment(${courseId}): No registrations data`);
      return null;
    }
    
    const enrollment = data.find(
      (reg) => {
        const regCourseId = reg.course?._id || reg.courseId;
        return regCourseId === courseId;
      }
    );
    
    console.log(`📊 getEnrollment(${courseId}):`, enrollment || 'Not found');
    return enrollment || null;
  };

  // Get a specific registration by course ID (alias for getEnrollment)
  const getRegistrationByCourse = (courseId) => {
    return getEnrollment(courseId);
  };

  // Get all enrolled courses (only active ones)
  const getActiveEnrollments = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return data.filter(
      (reg) => reg.status === 'active' || reg.status === 'completed'
    );
  };

  // Get all pending enrollments
  const getPendingEnrollments = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return data.filter((reg) => reg.status === 'pending');
  };

  // Debug logging
  console.log("🔄 useRegistrations state:", {
    hasData: !!data,
    isArray: Array.isArray(data),
    count: data?.length || 0,
    loading: isLoading,
    hasError: !!error,
    user: !!user
  });

  // Log all registrations with their statuses
  if (data && Array.isArray(data) && data.length > 0) {
    console.log("📚 All registrations:");
    data.forEach((reg, index) => {
      const courseId = reg.course?._id || reg.courseId;
      console.log(`  ${index + 1}. Course: ${reg.course?.title || 'Unknown'} (${courseId})`);
      console.log(`     Status: ${reg.status || 'unknown'}`);
      console.log(`     Payment: ${reg.paymentStatus || 'unpaid'}`);
    });
  }

  return {
    registrations: data || [],
    loading: isLoading,
    error,
    refetch,
    // Helper functions
    isEnrolled,
    getEnrollmentStatus,
    getPaymentStatus,
    isPendingPayment,
    isActiveEnrollment,
    isCancelledOrExpired,
    getEnrollment,
    getRegistrationByCourse,
    getActiveEnrollments,
    getPendingEnrollments,
    hasRegistrations: data && data.length > 0,
  };
};

export default useRegistrations;