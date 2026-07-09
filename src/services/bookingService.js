import {
  getMyBookingsApi
}
from "../api/bookingApi";



export const getMyBookings = async()=>{


  const response =
  await getMyBookingsApi();


  return response.data.data;


};