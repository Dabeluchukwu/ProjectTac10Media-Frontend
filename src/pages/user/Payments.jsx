import { useQuery } from "@tanstack/react-query";
import { getMyPayments } from "../../api/paymentApi";

const Payments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-payments"],
    queryFn: getMyPayments,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p className="font-semibold">Failed to load payments</p>
        <p className="text-sm mt-1">{error.message || "Please try again later"}</p>
      </div>
    );
  }

  const payments = data?.data?.data || [];

  const getPurposeLabel = (purpose) => {
    const labels = {
      course: "📚 Course Enrollment",
      booking: "📅 Service Booking",
      advertisement: "📢 Advertisement",
      other: "📌 Other",
    };
    return labels[purpose] || purpose;
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      success: "bg-green-500/20 text-green-400",
      failed: "bg-red-500/20 text-red-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-orange-400 mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">💳</div>
          <p className="text-gray-400 text-lg">No payment history yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Your payments will appear here once you make a purchase.
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Purpose</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Reference</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white">{getPurposeLabel(payment.purpose)}</p>
                        {payment.purpose === "course" && payment.registration?.course?.title && (
                          <p className="text-xs text-gray-400">{payment.registration.course.title}</p>
                        )}
                        {payment.purpose === "booking" && payment.booking?.service?.name && (
                          <p className="text-xs text-gray-400">{payment.booking.service.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-white font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-gray-400 font-mono">
                        {payment.paystackReference?.slice(0, 12)}...
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;