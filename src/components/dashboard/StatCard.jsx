// const StatCard = ({ title, value }) => {
//   return (
//     <div
//       className="
// bg-white
// rounded-xl
// p-6
// shadow
// "
//     >
//       <p
//         className="
// text-gray-500
// text-sm
// "
//       >
//         {title}
//       </p>

//       <h3
//         className="
// text-3xl
// font-bold
// mt-3
// "
//       >
//         {value}
//       </h3>
//     </div>
//   );
// };

// export default StatCard;


const StatCard = ({ title, value, icon, color }) => {
  const defaultColors = {
    bg: "bg-neutral-900",
    text: "text-white",
    border: "border-neutral-800",
  };

  return (
    <div className={`${color?.bg || defaultColors.bg} p-6 rounded-xl border ${color?.border || defaultColors.border}`}>
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{title}</p>
    </div>
  );
};

export default StatCard;