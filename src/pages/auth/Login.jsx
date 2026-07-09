import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../../services/authService";
import useAuthStore from "../../store/authStore";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Where user came from before login
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
    navigate("/super-admin/dashboard", {
      replace: true,
    });
    break;

  case "admin":
    navigate("/admin/dashboard", {
      replace: true,
    });
    break;

  case "instructor":
    navigate("/instructor/dashboard", {
      replace: true,
    });
    break;

  case "client":
  case "student":
    navigate("/dashboard", {
      replace: true,
    });
    break;

  default:
    navigate("/", {
      replace: true,
    });
}
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gray-100
    "
    >
      <div
        className="
      bg-white
      shadow-xl
      rounded-xl
      p-8
      w-full
      max-w-md
      "
      >
        <h1
          className="
        text-3xl
        font-bold
        text-center
        mb-6
        "
        >
          Welcome Back
        </h1>

        {error && (
          <div
            className="
          bg-red-100
          text-red-700
          p-3
          rounded
          mb-4
          "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="
          w-full
          border
          p-3
          rounded
          "
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="
            w-full
            border
            p-3
            rounded
            pr-12
            "
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
            absolute
            right-3
            top-3
            "
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="
          w-full
          bg-black
          text-white
          py-3
          rounded
          "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5">
          Don't have an account?
          <Link
            to="/register"
            state={{
              from,
            }}
            className="
          text-blue-600
          ml-2
          "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;