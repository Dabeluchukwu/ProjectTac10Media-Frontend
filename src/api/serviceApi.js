import api from "./axios";

// ==============================
// Public Routes
// ==============================

// Get all services
export const getServices = () => {
  return api.get("/services");
};

// Get single service
export const getService = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data.data;
};

// Get all packages (plans)
export const getPackages = () => {
  return api.get("/service-packages");
};

// Get single package
export const getPackage = async (id) => {
  const response = await api.get(`/service-packages/${id}`);
  // ✅ Return the nested data
  return response.data.data;
};

// ==============================
// Admin Routes - Services
// ==============================

// Get all services (admin - includes inactive)
export const getAllServicesAdmin = async () => {
  const response = await api.get("/services/admin/all");
  return response.data.data;
};

// Create service
export const createService = async (data) => {
  const response = await api.post("/services", data);
  return response.data.data;
};

// Update service
export const updateService = async (id, data) => {
  const response = await api.patch(`/services/${id}`, data);
  return response.data.data;
};

// Delete service
export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data.data;
};

// ==============================
// Admin Routes - Packages
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
