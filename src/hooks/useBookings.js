import { useQuery } from "@tanstack/react-query";

import {
  getMyBookings
} from "../api/bookingApi";


const useBookings = ()=>{


 const {
   data,
   isLoading,
   error

 } = useQuery({

   queryKey:["bookings"],

   queryFn:getMyBookings,

 });



 return {

   bookings:
   data?.data?.data || [],

   loading:isLoading,

   error,

 };


};


export default useBookings;