import { useNavigate } from "react-router-dom";
import StatCard from "../StatCard";
import useBookings from "../../../hooks/useBookings";
import usePayments from "../../../hooks/usePayments";
import RecentBookings from "../RecentBookings";
import PaymentHistory from "../PaymentHistory";

const ClientView = () => {
  const navigate = useNavigate();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { payments, loading: paymentsLoading } = usePayments();

  const totalPayments = payments
    .filter((p) => p.status === "success")
    .reduce((t, p) => t + p.amount, 0);

  const bookingsArray = bookings || [];
  const totalBookings = bookingsArray.length;
  const completedBookings = bookingsArray.filter((b) => b.status === "completed").length;
  const pendingBookings = bookingsArray.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookingsArray.filter((b) => b.status === "confirmed").length;

  const statCards = [
    {
      title: "Total Bookings",
      value: bookingsLoading ? "..." : totalBookings,
      icon: "📅",
      color: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/20" },
    },
    {
      title: "Pending",
      value: bookingsLoading ? "..." : pendingBookings,
      icon: "⏳",
      color: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/20" },
    },
    {
      title: "Completed",
      value: bookingsLoading ? "..." : completedBookings,
      icon: "✅",
      color: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/20" },
    },
    {
      title: "Total Spent",
      value: paymentsLoading ? "..." : `₦${totalPayments.toLocaleString()}`,
      icon: "💰",
      color: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/20" },
    },
  ];

  if (bookingsLoading || paymentsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
          <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">🎬 Book a Service</h3>
          <p className="text-sm text-gray-400 mb-4">Plan your next production or event coverage.</p>
          <button
            onClick={() => navigate("/plans-and-pricing")}
            className="w-full sm:w-auto bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition text-sm sm:text-base"
          >
            Book Now
          </button>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
          <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">📋 My Bookings</h3>
          <p className="text-sm text-gray-400 mb-4">View and manage your existing bookings.</p>
          <button
            onClick={() => navigate("/dashboard/bookings")}
            className="w-full sm:w-auto bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition text-sm sm:text-base"
          >
            View Bookings
          </button>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
          <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">💳 Payments</h3>
          <p className="text-sm text-gray-400 mb-4">View your payment history and invoices.</p>
          <button
            onClick={() => navigate("/dashboard/payments")}
            className="w-full sm:w-auto bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition text-sm sm:text-base"
          >
            View Payments
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RecentBookings bookings={bookings} loading={bookingsLoading} />
        <PaymentHistory payments={payments} loading={paymentsLoading} />
      </div>
    </div>
  );
};

export default ClientView;