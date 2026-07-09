import api from "./axios";


export const getMyCourses = ()=>{

  return api.get(
    "/course-registration"
  );

};