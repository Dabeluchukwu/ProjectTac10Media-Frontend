import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../../services/authService";
import useAuthStore from "../../store/authStore";
import { Eye, EyeOff, Film, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const from = location.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

      const response = await loginService(formData);
      console.log(response);

      login(
        response.data.user,
        response.data.token,
      );

      const role = response.data.user.role;

      const redirectPath = location.state?.from;

      if (redirectPath) {
        navigate(redirectPath, {
          replace: true,
        });
        return;
      }

      switch (role) {
        case "superAdmin":
          navigate("/super-admin/dashboard", { replace: true });
          break;
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "instructor":
          navigate("/instructor/dashboard", { replace: true });
          break;
        case "client":
        case "student":
          navigate("/dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] relative overflow-hidden">
      {/* Background cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black opacity-60" />
      
      {/* Decorative film strip effect */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-transparent to-amber-500/50" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#111214] rounded-2xl border border-[#2d2d2d] p-8 shadow-2xl shadow-amber-500/5">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <Film className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              TAC <span className="text-amber-400">10</span> MEDIA
            </h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back to the studio</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-sm font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-400 hover:text-amber-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-4 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  Logging in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                state={{ from }}
                className="text-amber-400 hover:text-amber-300 transition font-medium"
              >
                Register now
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

export default Login;