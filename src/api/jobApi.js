import api from "./axios";

// ==============================
// VACANCY API
// ==============================

// Get all vacancies (public)
export const getVacancies = async () => {
  try {
    const response = await api.get("/jobs");
    console.log("📊 getVacancies response:", response.data);
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching vacancies:", error);
    throw error;
  }
};

// Get single vacancy
export const getVacancyById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    console.log("📊 getVacancyById response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching vacancy:", error);
    throw error;
  }
};

// Create vacancy (admin only)
export const createVacancy = async (data) => {
  console.log("📤 Creating vacancy with data:", data);
  const response = await api.post("/jobs", data);
  console.log("✅ Vacancy created:", response.data);
  return response.data.data;
};

// Update vacancy (admin only)
export const updateVacancy = async (id, data) => {
  const response = await api.patch(`/jobs/${id}`, data);
  return response.data.data;
};

// Delete vacancy (admin only)
export const deleteVacancy = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data.data;
};

// ==============================
// APPLICATION API
// ==============================

// Get applications for a vacancy (admin only)
export const getApplicationsByVacancy = async (vacancyId) => {
  const response = await api.get(`/job-applications/vacancy/${vacancyId}`);
  return response.data.data;
};

// Update application status (admin only)
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/job-applications/${applicationId}`, { status });
  return response.data.data;
};

// Delete application
export const deleteApplication = async (applicationId) => {
  const response = await api.delete(`/job-applications/${applicationId}`);
  return response.data.data;
};

// Get my applications (user)
export const getMyApplications = async () => {
  const response = await api.get("/job-applications/my-applications");
  return response.data.data;
};

// Submit application (user)
export const submitApplication = async (data) => {
  const response = await api.post("/job-applications", data);
  return response.data.data;
};