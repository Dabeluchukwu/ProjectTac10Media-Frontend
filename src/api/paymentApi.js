import api from "./axios";


// Initialize Paystack payment

export const initializePayment = (data)=>{

  return api.post(
    "/payments/initialize",
    data
  );

};



// Verify payment

export const verifyPayment = (reference)=>{

  return api.get(
    `/payments/verify/${reference}`
  );

};



// My payments

export const getMyPayments = ()=>{

  return api.get(
    "/payments/my-payments"
  );

};


// Get all payments (admin)
export const getAllPayments = async () => {
  const response = await api.get("/payments/admin/all");
  console.log("📊 getAllPayments response:", response.data);
  // Return the data array, not the whole response
  return response.data.data;
};