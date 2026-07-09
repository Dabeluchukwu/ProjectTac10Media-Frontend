import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { verifyPayment, initializePayment } from "../../api/paymentApi";
import useAuthStore from "../../store/authStore";

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reference = searchParams.get("reference");
  const purpose = searchParams.get("purpose"); // ✅ Get purpose from URL
  let registrationId = searchParams.get("registrationId");
  let bookingId = searchParams.get("bookingId"); // ✅ Get bookingId from URL
  const amount = searchParams.get("amount");

  // ✅ If registrationId is 'null' string, convert to null
  if (registrationId === 'null' || registrationId === 'undefined') {
    registrationId = null;
  }

  // ✅ If bookingId is 'null' string, convert to null
  if (bookingId === 'null' || bookingId === 'undefined') {
    bookingId = null;
  }

  const parsedAmount = parseFloat(amount) || 0;

  console.log("🔍 PaymentCheckout - Parsed values:");
  console.log("  reference:", reference);
  console.log("  purpose:", purpose);
  console.log("  registrationId (cleaned):", registrationId);
  console.log("  bookingId (cleaned):", bookingId);
  console.log("  amount (raw):", amount);
  console.log("  parsedAmount:", parsedAmount);

  // ✅ AUTH DEBUG
  const token = localStorage.getItem("token");
  console.log("🔍 AUTH DEBUG:");
  console.log("  user:", user);
  console.log("  user id:", user?._id || user?.id);
  console.log("  token exists:", !!token);
  console.log("  isAuthenticated:", !!user && !!token);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!user || !token) {
      console.warn("⚠️ Not authenticated - redirecting to login");
      navigate("/login", {
        state: { from: `/checkout/${courseId}` },
      });
    }
  }, [user, token, navigate, courseId]);

  useEffect(() => {
    if (reference) {
      setStatus("verifying");
      verifyPaymentHandler();
    } else if (courseId) {
      // ✅ Check if we have registrationId before initializing (course payment)
      if (!registrationId) {
        console.error("❌ No registrationId found in URL!");
        setStatus("failed");
        setError("Registration not found. Please go back and try again.");
        return;
      }
      initializePaymentHandler();
    } else {
      setStatus("failed");
      setError("No payment information found");
    }
  }, [reference, courseId]);

  const initializePaymentHandler = async () => {
    setLoading(true);
    try {
      // ✅ Build request data based on purpose
      let requestData = {};

      if (purpose === "booking") {
        // ✅ Booking payment
        requestData = {
          purpose: "booking",
          bookingId: bookingId,
          email: user?.email,
          referenceId: bookingId,
          amount: parsedAmount,
        };
        console.log("📤 Sending booking payment request:", requestData);
      } else {
        // ✅ Course payment (default)
        requestData = {
          purpose: "course",
          registrationId: registrationId,
          email: user?.email,
          referenceId: courseId,
          amount: parsedAmount,
        };
        console.log("📤 Sending course payment request:", requestData);
      }

      const response = await initializePayment(requestData);

      console.log("📥 Payment response:", response);

      if (response?.data?.data?.authorizationUrl) {
        window.location.href = response.data.data.authorizationUrl;
      } else {
        setStatus("failed");
        setError("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setStatus("failed");
      setError(error?.response?.data?.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentHandler = async () => {
    console.log("📤 verifyPaymentHandler called");
    console.log("  Reference:", reference);
    console.log("  Purpose:", purpose);

    try {
      const response = await verifyPayment(reference);
      console.log("📥 Verify payment response:", response);
      console.log("  response.data:", response?.data);
      console.log("  status:", response?.data?.data?.status);

      if (response?.data?.data?.status === "success") {
        console.log("✅ Payment verified successfully!");

        // ✅ Invalidate cache based on purpose
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
        queryClient.invalidateQueries({ queryKey: ["progress"] });
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["my-payments"] });

        setStatus("success");
        
        // ✅ Redirect based on purpose
        setTimeout(() => {
          if (purpose === "booking") {
            navigate("/dashboard/bookings");
          } else {
            navigate("/dashboard/courses");
          }
        }, 3000);
      } else {
        console.log("❌ Payment verification failed - status not success");
        setStatus("failed");
        setError("Payment verification failed");
      }
    } catch (error) {
      console.error("❌ Payment verification failed:", error);
      console.error("  error.response:", error?.response);
      console.error("  error.response.data:", error?.response?.data);
      setStatus("failed");
      setError(error?.response?.data?.message || "Payment verification failed");
    }
  };

  // Loading states...
  if (status === "initializing" || loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Initializing Payment</h2>
          <p className="text-gray-400">Please wait while we prepare your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Verifying Payment</h2>
          <p className="text-gray-400">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-4">
            {purpose === "booking" 
              ? "Your booking has been confirmed! You will be redirected to your bookings."
              : "Your payment has been confirmed. You now have full access to your course."}
          </p>
          <div className="bg-neutral-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-400">Reference:</p>
            <p className="text-xs font-mono text-amber-400 break-all">{reference}</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 max-w-md text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
        <p className="text-gray-400 mb-4">{error || "Something went wrong with your payment."}</p>

        {reference && (
          <div className="bg-neutral-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-400">Reference:</p>
            <p className="text-xs font-mono text-red-400 break-all">{reference}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-400 hover:text-white text-sm transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;