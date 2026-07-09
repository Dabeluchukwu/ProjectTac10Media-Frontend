import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { registerService } from "../../services/authService";
import { Eye, EyeOff, Film, Mail, Lock, User, Phone, UserPlus, ArrowRight, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await registerService(formData);
      setSuccess("Account created successfully! 🎉");

      console.log(response);

      setTimeout(() => {
        navigate("/login", {
          state: { from },
        });
      }, 1500);
    } catch (err) {
      console.log("REGISTER ERROR:", err.response);
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] relative overflow-hidden">
      {/* Background cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black opacity-60" />
      
      {/* Decorative film strip effects */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#111214] rounded-2xl border border-[#2d2d2d] p-8 shadow-2xl shadow-amber-500/5">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <UserPlus className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              TAC <span className="text-amber-400">10</span> MEDIA
            </h1>
            <p className="text-gray-400 text-sm mt-1">Join the creative community</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1.5">
                Phone Number <span className="text-gray-600">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1.5">
                I am a <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                    formData.role === "student"
                      ? "bg-amber-500/20 border-amber-500"
                      : "bg-[#1a1a1c] border-[#2d2d2d] hover:border-amber-500/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-lg">🎓</span>
                  <span className="text-sm text-white font-medium">Student</span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                    formData.role === "client"
                      ? "bg-amber-500/20 border-amber-500"
                      : "bg-[#1a1a1c] border-[#2d2d2d] hover:border-amber-500/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === "client"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-lg">💼</span>
                  <span className="text-sm text-white font-medium">Client</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from }}
                className="text-amber-400 hover:text-amber-300 transition font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Decorative bottom line */}
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

export default Register;