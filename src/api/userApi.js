import api from "./axios";

// Get all users (filter by role)
export const getAllUsers = async (params = {}) => {
  const response = await api.get("/users", { params });
  console.log("📊 getAllUsers - Request params:", params);
  console.log("📊 getAllUsers - Response:", response.data);
  return response.data.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data.data;
};

// Create admin (super admin only)
export const createAdmin = async (data) => {
  const response = await api.post("/users/admin", data);
  return response.data.data;
};
// ✅ Create instructor (admin only)
export const createInstructor = async (data) => {
  const response = await api.post("/users/instructor", data);
  return response.data.data;
};

// Get platform stats (super admin only)
export const getPlatformStats = async () => {
  const response = await api.get("/dashboard/platform");
  return response.data.data;
};


// ==============================
// Profile API (NEW)
// ==============================

// ✅ Get current user profile
export const getProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
// ✅ Update profile
export const updateProfile = async (data) => {
  const response = await api.put("/users/me", data);
  return response.data.data;
};

// ✅ Change password
export const changePassword = async (data) => {
  const response = await api.patch("/users/me/password", data);
  return response.data.data;
};

// ✅ Upload profile photo
export const uploadProfilePhoto = async (data) => {
  const response = await api.post("/users/me/photo", data);
  return response.data.data;
};

// ✅ Remove profile photo
export const removeProfilePhoto = async () => {
  const response = await api.delete("/users/me/photo");
  return response.data.data;
};