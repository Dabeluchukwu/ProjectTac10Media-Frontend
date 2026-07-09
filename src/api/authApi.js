import api from "./axios";

// register user

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// login user

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// verify email

export const verifyEmail = (data) => {
  return api.post("/auth/verify-email", data);
};

// forgot password

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

// reset password

export const resetPassword = (token, data) => {
  return api.post(`/auth/reset-password/${token}`, data);
};