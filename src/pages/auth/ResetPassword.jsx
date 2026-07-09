import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle, Film, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validToken, setValidToken] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/v1/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Something went wrong");
        toast.error(data.message || "Something went wrong");
        if (data.message?.includes("expired")) {
          setValidToken(false);
        }
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black opacity-60" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#111214] rounded-2xl border border-[#2d2d2d] p-8 shadow-2xl shadow-amber-500/5">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create New Password
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {validToken ? "Enter your new password below" : "This link is no longer valid"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              {error}
            </div>
          )}

          {!validToken && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Invalid or Expired Link</h3>
              <p className="text-gray-400 text-sm mb-6">
                The password reset link you used is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition inline-block"
              >
                Request New Link
              </Link>
            </div>
          )}

          {success && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful!</h3>
              <p className="text-gray-400 text-sm mb-6">
                Your password has been reset. Redirecting to login...
              </p>
              <div className="w-full bg-neutral-700 rounded-full h-1.5 max-w-[200px] mx-auto overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full animate-pulse w-full" />
              </div>
            </div>
          )}

          {validToken && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
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

export default ResetPassword;