// services/courseRegistrationService.js
import {
  getMyRegistrations as getMyRegistrationsApi,
  createRegistration as createRegistrationApi
} from "../api/courseRegistrationApi";

// Get my courses (enrollments)
export const getMyRegistrations = async () => {
  console.log("🔍 Service: getMyRegistrations");
  
  try {
    const response = await getMyRegistrationsApi();
    console.log("📚 Raw API response:", response);
    console.log("📚 Response data:", response.data);
    
    // Handle different response structures
    let registrations = [];
    
    // Check if response.data is the array directly
    if (Array.isArray(response.data)) {
      registrations = response.data;
    } 
    // Check if response.data.data is the array
    else if (response.data?.data && Array.isArray(response.data.data)) {
      registrations = response.data.data;
    }
    // Check if response.data.registrations is the array
    else if (response.data?.registrations && Array.isArray(response.data.registrations)) {
      registrations = response.data.registrations;
    }
    
    console.log("📚 Processed registrations:", registrations);
    console.log("📚 Number of registrations:", registrations.length);
    
    // Log each registration for debugging
    if (registrations.length > 0) {
      registrations.forEach((reg, index) => {
        console.log(`📚 Registration ${index + 1}:`, {
          id: reg._id,
          courseId: reg.course?._id || reg.courseId,
          courseTitle: reg.course?.title,
          status: reg.status
        });
      });
    } else {
      console.warn("⚠️ No registrations found");
    }
    
    return registrations;
  } catch (error) {
    console.error("❌ Service error:", error);
    throw error;
  }
};

// Enroll course
export const enrollCourseService = async (courseId) => {
  console.log("📝 Service: enrollCourseService for course:", courseId);
  
  try {
    const response = await createRegistrationApi(courseId);
    console.log("✅ Enrollment service response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Enrollment service error:", error);
    throw error;
  }
};