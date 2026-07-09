import {
getMyCourses
} from "../api/registrationApi";



export const fetchMyCourses = async()=>{


const response =
await getMyCourses();


return response.data.data;


};