// api/courseRegistrationApi.js
import api from "./axios";

// Get my registrations (enrollments)
export const getMyRegistrations = async () => {
  console.log("🔍 API call: GET /course-registration");
  
  try {
    const response = await api.get("/course-registration");
    console.log("✅ Registrations response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error fetching registrations:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
};

// Register for course
export const createRegistration = async (courseId) => {
  console.log("📝 API call: POST /course-registration for course:", courseId);
  
  try {
    const response = await api.post("/course-registration", {
      course: courseId,
    });
    console.log("✅ Registration response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error creating registration:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
};