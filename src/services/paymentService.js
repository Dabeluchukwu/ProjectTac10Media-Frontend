import {
  getMyPaymentsApi
}
from "../api/paymentApi";



export const getMyPayments = async()=>{


  const response =
  await getMyPaymentsApi();



  return response.data.data;


};