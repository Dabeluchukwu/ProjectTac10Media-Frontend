import {
useQuery
} from "@tanstack/react-query";


import {
fetchMyCourses
} from "../services/registrationService";



const useMyCourses = ()=>{


const {

data,

isLoading,

error

}=useQuery({

queryKey:[
"my-courses"
],


queryFn:
fetchMyCourses


});



return {

courses:data || [],

loading:isLoading,

error

};


};



export default useMyCourses;