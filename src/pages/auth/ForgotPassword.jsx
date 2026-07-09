import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft, CheckCircle, Film, AlertCircle, RefreshCw } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendResetEmail();
  };

  const sendResetEmail = async () => {
    if (!email) {
      setError("Please enter your email address");
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setResendCount(prev => prev + 1);
        toast.success("Password reset email sent!");
        
        // Enable resend after 30 seconds
        setCanResend(false);
        setTimeout(() => {
          setCanResend(true);
        }, 30000);
      } else {
        setError(data.message || "Something went wrong");
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send reset email. Please check your connection.");
      toast.error("Failed to send reset email. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (canResend) {
      sendResetEmail();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black opacity-60" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#111214] rounded-2xl border border-[#2d2d2d] p-8 shadow-2xl shadow-amber-500/5">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {success ? "Check your email" : "Enter your email to receive a reset link"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
              <p className="text-gray-400 text-sm mb-2">
                We've sent a password reset link to <br />
                <span className="text-amber-400 font-medium">{email}</span>
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Please check your inbox and spam folder for the email.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  disabled={!canResend || loading}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                    canResend && !loading
                      ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                      : "bg-neutral-800/50 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Sending..." : canResend ? "Resend Link" : "Wait 30s to resend"}
                </button>
                
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
                >
                  Return to Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the email you used to register
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-amber-400 hover:text-amber-300 transition font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1d1d1f] flex justify-center gap-6 text-xs text-gray-600">
            <span>🎬 Cinematography</span>
            <span>📹 Production</span>
            <span>🎥 Editing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;