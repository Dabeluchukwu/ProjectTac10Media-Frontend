import api from "./axios";

// ==============================
// Student Routes
// ==============================

// Get exam for a course
export const getExamByCourse = async (courseId) => {
  const response = await api.get(`/exams/course/${courseId}`);
  return response.data.data; // Will be null if no exam exists
};

// Get attempt status
export const getAttemptStatus = (examId) => {
  return api.get(`/exams/${examId}/status`);
};

// Start exam
export const startExam = (data) => {
  return api.post("/exams/start", data);
};

// Retake exam
export const retakeExam = (data) => {
  return api.post("/exams/retake", data);
};

// Submit exam
export const submitExam = (data) => {
  return api.post("/exams/submit", data);
};

// Get exam results
export const getExamResults = (examId) => {
  return api.get(`/exams/${examId}/results`);
};

// ==============================
// Instructor Routes (NEW)
// ==============================

// Get exam by ID
export const getExamById = (examId) => {
  return api.get(`/exams/${examId}`);
};

// Create exam
export const createExam = (data) => {
  return api.post("/exams", data);
};

// Update exam
export const updateExam = (examId, data) => {
  return api.put(`/exams/${examId}`, data);
};

// Delete exam
export const deleteExam = (examId) => {
  return api.delete(`/exams/${examId}`);
};

// Toggle publish status
export const toggleExamPublish = (examId, isPublished) => {
  return api.patch(`/exams/${examId}/publish`, { isPublished });
};