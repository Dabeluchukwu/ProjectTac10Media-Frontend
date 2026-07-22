import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyBookings } from "../../api/bookingApi";
import { initializePayment } from "../../api/paymentApi";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";
import { useState } from "react";
import ManualPaymentModal from "../../components/payment/ManualPaymentModal";
import { PAYMENT_METHOD } from "../../config";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const handlePayNow = async (booking) => {
    if (PAYMENT_METHOD === "manual") {
      setSelectedBooking(booking);
      setShowManualModal(true);
      return;
    }

    // Original Paystack flow
    try {
      const response = await initializePayment({
        purpose: "booking",
        bookingId: booking._id,
        email: user?.email,
        referenceId: booking._id,
        amount: booking.amount,
      });

      if (response?.data?.data?.authorizationUrl) {
        window.location.href = response.data.data.authorizationUrl;
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p className="font-semibold">Failed to load bookings</p>
        <p className="text-sm mt-1">
          {error.message || "Please try again later"}
        </p>
      </div>
    );
  }

  const bookings = data?.data?.data || [];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      confirmed: "bg-blue-500/20 text-blue-400",
      completed: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
  };

  const getPaymentBadge = (status) => {
    const styles = {
      unpaid: "bg-yellow-500/20 text-yellow-400",
      paid: "bg-green-500/20 text-green-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-400">My Bookings</h1>
        <button
          onClick={() => navigate("/plans-and-pricing")}
          className="bg-amber-500 text-black px-5 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Book New Service
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <p className="text-gray-400 text-lg">
            You haven't made any bookings yet.
          </p>
          <button
            onClick={() => navigate("/plans-and-pricing")}
            className="mt-4 bg-amber-500 px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition text-black"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-white">
                    {booking.service?.name ||
                      booking.package?.name ||
                      "Booking"}
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusBadge(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                  {booking.service?.description ||
                    booking.package?.description ||
                    "No description"}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">
                      {formatDate(booking.bookingDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{booking.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-amber-400 font-semibold">
                      {formatCurrency(booking.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment:</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getPaymentBadge(booking.paymentStatus)}`}
                    >
                      {booking.paymentStatus === "paid"
                        ? "✅ Paid"
                        : "⏳ Unpaid"}
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                {booking.paymentStatus === "unpaid" &&
                  booking.status !== "cancelled" && (
                    <button
                      onClick={() => handlePayNow(booking)}
                      className="mt-4 w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
                    >
                      💳 Pay Now
                    </button>
                  )}

                {booking.paymentStatus === "paid" && (
                  <div className="mt-4 w-full bg-green-500/10 text-green-400 py-2 rounded-lg text-center text-sm font-medium border border-green-500/20">
                    ✅ Payment Confirmed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal placed INSIDE the return statement - FIXED */}
      {showManualModal && selectedBooking && (
        <ManualPaymentModal
          isOpen={showManualModal}
          onClose={() => {
            setShowManualModal(false);
            setSelectedBooking(null);
          }}
          purpose="booking"
          referenceId={selectedBooking._id}
          amount={selectedBooking.amount}
          onSuccess={() => {
            queryClient.invalidateQueries(["my-bookings"]);
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;