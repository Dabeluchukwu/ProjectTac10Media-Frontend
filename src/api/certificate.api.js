import api from "./axios";

// Get my certificates
export const getMyCertificates = async () => {
  const response = await api.get("/certificates/my");
  return response.data.data;
};

// Verify certificate
export const verifyCertificate = (certificateNumber) => {
  return api.get(`/certificates/verify/${certificateNumber}`);
};