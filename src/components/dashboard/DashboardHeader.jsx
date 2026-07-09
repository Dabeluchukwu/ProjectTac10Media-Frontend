// import useAuthStore from "../../store/authStore";

// const DashboardHeader = () => {

//   const user = useAuthStore(
//     (state) => state.user
//   );

//   const logout = useAuthStore(
//     (state) => state.logout
//   );


//   return (
//     <div className="flex justify-between items-center mb-8">

//       <div>
//         <h1 className="text-3xl font-bold">
//           Welcome, {user?.firstName}
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Manage your cinematography journey
//         </p>
//       </div>

//     </div>
//   );
// };


// export default DashboardHeader;

import useAuthStore from "../../store/authStore";

const DashboardHeader = () => {
  const user = useAuthStore((state) => state.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        {getGreeting()}, {user?.firstName || "User"}! 👋
      </h1>
      <p className="text-gray-400 text-sm mt-1">
        Welcome back to your dashboard
      </p>
    </div>
  );
};

export default DashboardHeader;