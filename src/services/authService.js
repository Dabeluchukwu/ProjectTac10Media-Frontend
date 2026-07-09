import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../api/authApi";

export const registerService = async (data) => {
  const response = await registerUser(data);

  return response.data;
};

export const loginService = async (data) => {
  const response = await loginUser(data);

  return response.data;
};

export const verifyEmailService = async (data) => {
  const response = await verifyEmail(data);

  return response.data;
};

export const forgotPasswordService = async (data) => {
  const response = await forgotPassword(data);

  return response.data;
};

export const resetPasswordService = async (data) => {
  const response = await resetPassword(data);

  return response.data;
};
