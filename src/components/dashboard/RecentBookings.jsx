import { useNavigate } from "react-router-dom";

const RecentBookings = ({ bookings = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      confirmed: "bg-blue-500/20 text-blue-400",
      completed: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
      in_progress: "bg-purple-500/20 text-purple-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
        {bookings.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/bookings")}
            className="text-sm text-amber-400 hover:text-amber-300 transition"
          >
            View All
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No bookings yet.</p>
          <button
            onClick={() => navigate("/plans-and-pricing")}
            className="mt-2 text-amber-400 hover:text-amber-300 text-sm transition"
          >
            Book a Service →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {booking.service?.name || booking.package?.name || "Booking"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(booking.status)}`}>
                    {booking.status || "pending"}
                  </span>
                  <span className="text-xs text-gray-400">{formatCurrency(booking.amount)}</span>
                </div>
                <p className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookings.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard/bookings")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            +{bookings.length - 5} more bookings
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;