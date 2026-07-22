// import api from "./axios";


// // Initialize Paystack payment

// export const initializePayment = (data)=>{

//   return api.post(
//     "/payments/initialize",
//     data
//   );

// };



// // Verify payment

// export const verifyPayment = (reference)=>{

//   return api.get(
//     `/payments/verify/${reference}`
//   );

// };



// // My payments

// export const getMyPayments = ()=>{

//   return api.get(
//     "/payments/my-payments"
//   );

// };


// // Get all payments (admin)
// export const getAllPayments = async () => {
//   const response = await api.get("/payments/admin/all");
//   console.log("📊 getAllPayments response:", response.data);
//   // Return the data array, not the whole response
//   return response.data.data;
// };


import api from "./axios";

// Initialize Paystack payment
export const initializePayment = (data) => {
  return api.post("/payments/initialize", data);
};

// Verify payment
export const verifyPayment = (reference) => {
  return api.get(`/payments/verify/${reference}`);
};

// My payments
export const getMyPayments = () => {
  return api.get("/payments/my-payments");
};

// Get all payments (admin)
export const getAllPayments = async () => {
  const response = await api.get("/payments/admin/all");
  return response.data.data;
};

// ==============================
// MANUAL PAYMENT APIS
// ==============================

// Submit manual payment
export const submitManualPayment = (data) => {
  return api.post("/manual-payments/submit", data);
};

// Get user's manual payments
export const getMyManualPayments = () => {
  return api.get("/manual-payments/my-payments");
};

// Admin: Get pending manual payments
export const getPendingManualPayments = () => {
  return api.get("/manual-payments/admin/pending");
};

// Admin: Get all manual payments
export const getAllManualPayments = (status) => {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  return api.get(`/manual-payments/admin/all${query}`);
};

// Admin: Confirm manual payment
export const confirmManualPayment = (id, notes) => {
  return api.patch(`/manual-payments/admin/${id}/confirm`, { notes });
};

// Admin: Reject manual payment
export const rejectManualPayment = (id, rejectionReason) => {
  return api.patch(`/manual-payments/admin/${id}/reject`, { rejectionReason });
};

// Admin: Bank Account CRUD
export const getBankAccounts = async () => {
  const response = await api.get("/bank-accounts");
  return response.data.data; // ✅ return the array, not the whole response
};
export const createBankAccount = (data) => {
  return api.post("/bank-accounts", data);
};

export const updateBankAccount = (id, data) => {
  return api.patch(`/bank-accounts/${id}`, data);
};

export const deleteBankAccount = (id) => {
  return api.delete(`/bank-accounts/${id}`);
};

export const toggleBankAccountStatus = (id) => {
  return api.patch(`/bank-accounts/${id}/toggle`);
};