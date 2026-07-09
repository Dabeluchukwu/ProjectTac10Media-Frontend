import {
  getCourses,
  getCourseById
} from "../api/courseApi";



export const fetchCourses = async()=>{

 const response = await getCourses();

 return response.data;

};




export const fetchCourse = async (id) => {
  const response = await getCourseById(id);
  // ✅ Since getCourseById already returns the data, just return it
  return response;
};