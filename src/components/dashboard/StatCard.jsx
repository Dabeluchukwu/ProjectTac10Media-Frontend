const StatCard = ({ title, value, icon, color }) => {
  const defaultColors = {
    bg: "bg-neutral-900",
    text: "text-white",
    border: "border-neutral-800",
  };

  return (
    <div
      className={`${color?.bg || defaultColors.bg} p-4 sm:p-6 rounded-xl border ${
        color?.border || defaultColors.border
      }`}
    >
      {icon && (
        <div className={`text-2xl sm:text-3xl mb-1 sm:mb-2 ${color?.text || defaultColors.text}`}>
          {icon}
        </div>
      )}

      <p className={`text-xl sm:text-2xl font-bold ${color?.text || defaultColors.text}`}>
        {value}
      </p>

      <p className={`text-xs sm:text-sm opacity-80 ${color?.text || defaultColors.text}`}>
        {title}
      </p>
    </div>
  );
};

export default StatCard;