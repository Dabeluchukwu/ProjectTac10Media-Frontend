import api from "./axios";

// ==============================
// Public Routes
// ==============================

// Get all packages (public)
export const getPackages = () => {
  return api.get("/service-packages");
};

// Get single package (public)
export const getPackage = (id) => {
  return api.get(`/service-packages/${id}`);
};

// ==============================
// Admin Routes
// ==============================

// Get all packages (admin - includes inactive)
export const getAllPackagesAdmin = async () => {
  const response = await api.get("/service-packages/admin/all");
  return response.data.data;
};

// Create package
export const createPackage = async (data) => {
  const response = await api.post("/service-packages", data);
  return response.data.data;
};

// Update package
export const updatePackage = async (id, data) => {
  const response = await api.patch(`/service-packages/${id}`, data);
  return response.data.data;
};

// Delete package
export const deletePackage = async (id) => {
  const response = await api.delete(`/service-packages/${id}`);
  return response.data.data;
};