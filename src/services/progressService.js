import {
getCourseProgressApi
}
from "../api/progressApi";



export const getCourseProgress = async(courseId)=>{


const response =
await getCourseProgressApi(courseId);



return response.data.data;


};