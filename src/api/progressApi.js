import api from "./axios";



// Start course progress

export const startCourseProgress = async (courseId) => {
  console.log("🚀 Starting course progress for:", courseId);
  
  try {
    // ✅ POST /course-progress
    const response = await api.post('/course-progress', { courseId });
    console.log("✅ Course progress started:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error starting course progress:", error);
    throw error;
  }
};



// Get my course progress

export const getMyProgress = async (courseId) => {
  console.log("🔍 Fetching progress for course:", courseId);
  
  try {
    // ✅ GET /course-progress/my/:courseId
    const response = await api.get(`/course-progress/my/${courseId}`);
    console.log("✅ Progress fetched:", response.data);
    return response;
  } catch (error) {
    console.log("❌ Error fetching progress:", error.response?.status);
    
    // If 404, return empty progress
    if (error.response?.status === 404) {
      console.log("📝 No progress found - returning empty progress");
      return {
        data: {
          data: {
            completedLessons: [],
            progressPercentage: 0
          }
        }
      };
    }
    
    throw error;
  }
};

// Complete lesson

export const completeLesson = async (courseId, lessonId) => {
  console.log("📤 Completing lesson:", { courseId, lessonId });
  
  try {
    // ✅ PATCH /course-progress/:courseId/lesson
    const response = await api.patch(
      `/course-progress/${courseId}/lesson`,
      { lessonId }
    );
    console.log("✅ Lesson completed successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error completing lesson:", error.response?.status);
    console.error("❌ Error details:", error.response?.data);
    
    // Handle specific error codes
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to complete this lesson. Please check your enrollment.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Course or lesson not found.");
    }
    
    throw error;
  }
};


// Get all progress (admin only)
export const getCourseProgressList = async () => {
  try {
    // ✅ GET /course-progress
    const response = await api.get('/course-progress');
    return response;
  } catch (error) {
    console.error("❌ Error fetching progress list:", error);
    throw error;
  }
};