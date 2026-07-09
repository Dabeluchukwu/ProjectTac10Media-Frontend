const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      user_registered: "👤",
      course_enrolled: "📚",
      course_created: "📝",
      booking_made: "📅",
      payment_received: "💰",
      review_submitted: "⭐",
    };
    return icons[type] || "📌";
  };

  const getActivityColor = (type) => {
    const colors = {
      user_registered: "text-blue-400",
      course_enrolled: "text-green-400",
      course_created: "text-amber-400",
      booking_made: "text-purple-400",
      payment_received: "text-emerald-400",
      review_submitted: "text-yellow-400",
    };
    return colors[type] || "text-gray-400";
  };

  if (activities.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-400 text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">{activity.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(activity.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;