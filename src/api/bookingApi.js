import api from "./axios";


// Get my bookings

export const getMyBookings = () => {

  return api.get("/bookings");

};


// Create booking

export const createBooking = (data)=>{

  return api.post(
    "/bookings",
    data
  );

};




/**
 * Get all bookings (admin)
 */
export const getAllBookings = async (params = {}) => {
  const response = await api.get("/bookings/admin/all", { params });
  return response.data.data;
};

/**
 * Update booking status (admin)
 */
export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data.data;
};


//  Update booking progress (admin)
export const updateBookingProgress = async (bookingId, progress) => {
  const response = await api.patch(`/bookings/admin/${bookingId}/progress`, { progress });
  return response.data.data;
};