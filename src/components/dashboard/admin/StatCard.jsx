const StatCard = ({ icon, label, value, color, subtitle }) => {
  return (
    <div className={`${color} p-6 rounded-xl border border-neutral-800`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
      {subtitle && (
        <p className="text-xs opacity-60 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;