import { useNavigate } from "react-router-dom";

const PaymentHistory = ({ payments = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const colors = {
      success: "bg-green-500/20 text-green-400",
      pending: "bg-yellow-500/20 text-yellow-400",
      failed: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-white">Payment History</h2>
        {payments.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/payments")}
            className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition"
          >
            View All
          </button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No payments yet.</p>
          <p className="text-sm text-gray-500 mt-1">Your payments will appear here.</p>
        </div>
      ) : (
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <div className="min-w-full inline-block align-middle px-4 sm:px-0">
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment._id}
                  className="flex flex-wrap items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(payment.status)}`}>
                        {payment.status || "pending"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400">
                        {formatDate(payment.createdAt)}
                      </p>
                      {payment.purpose && (
                        <span className="text-xs text-gray-500">
                          {payment.purpose === "course" ? "Course Enrollment" : 
                           payment.purpose === "booking" ? "Service Booking" : 
                           payment.purpose || "Payment"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {payments.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard/payments")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            +{payments.length - 5} more payments
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;