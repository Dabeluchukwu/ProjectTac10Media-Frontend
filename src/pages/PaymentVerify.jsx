import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  const purpose = searchParams.get("purpose");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `https://projecttac10media-backend.onrender.com/api/v1/payments/verify/${reference || trxref}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("Could not verify payment. Please contact support.");
      }
    };

    if (reference || trxref) {
      verifyPayment();
    } else {
      setStatus("failed");
      setMessage("No payment reference found.");
    }
  }, [reference, trxref]);

  // Determine where to redirect based on purpose
  const getRedirectPath = () => {
    if (purpose === "booking") return "/dashboard/bookings";
    if (purpose === "course") return "/dashboard/courses";
    return "/dashboard";
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto" />
          <h2 className="text-xl text-white mt-4">Verifying Payment...</h2>
          <p className="text-gray-400 mt-2">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] p-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-xl border border-neutral-800 p-8 text-center">
        {status === "success" ? (
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        )}

        <h2 className={`text-2xl font-bold mt-4 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {status === "success" ? "Payment Successful!" : "Payment Failed"}
        </h2>

        <p className="text-gray-400 mt-2">{message}</p>

        <div className="mt-6 space-y-3">
          <Link
            to={status === "success" ? getRedirectPath() : "/"}
            className="block w-full bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            {status === "success" ? "Go to Dashboard" : "Return Home"}
          </Link>

          {status === "failed" && (
            <button
              onClick={() => window.history.back()}
              className="block w-full border border-neutral-700 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;