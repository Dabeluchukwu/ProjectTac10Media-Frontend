import { useQuery } from "@tanstack/react-query";
import { getMyRegistrations } from "../api/courseRegistrationApi";
import useAuthStore from "../store/authStore";

const useCourseEnrollment = (courseId) => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["registrations"],
    queryFn: getMyRegistrations,
    enabled: !!user,
  });

  const registrations = data?.data?.data || [];

  // Check enrollment using multiple possible ID fields
  const isEnrolled = registrations.some((item) => {
    // Check if course ID matches in different possible locations
    const courseIdMatch = 
      item.course?._id === courseId ||  // If course is populated object
      item.courseId === courseId ||     // If courseId is direct property
      item.course?._id?.toString() === courseId?.toString() ||  // Handle type differences
      item.courseId?.toString() === courseId?.toString();
    
    // Debug logging to see what's happening
    if (courseIdMatch) {
      console.log("Found enrollment match:", {
        courseId,
        itemCourseId: item.course?._id,
        itemCourseIdDirect: item.courseId,
        registration: item
      });
    }
    
    return courseIdMatch;
  });

  // Debug logging for debugging purposes
  console.log("useCourseEnrollment Debug:", {
    courseId,
    totalRegistrations: registrations.length,
    isEnrolled,
    registrations: registrations.map(r => ({
      id: r._id,
      courseId: r.course?._id,
      courseIdDirect: r.courseId,
      courseTitle: r.course?.title
    }))
  });

  return {
    isEnrolled,
    loading: isLoading,
    error,
    registrations, // Expose registrations for debugging
  };
};

export default useCourseEnrollment;