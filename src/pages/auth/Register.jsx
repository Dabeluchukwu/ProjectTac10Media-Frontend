import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { registerService } from "../../services/authService";

import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const location = useLocation();

  // Page user originally wanted to visit

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

      setSuccess("Account created successfully");

      console.log(response);

      setTimeout(() => {
        navigate(
          "/login",

          {
            state: {
              from,
            },
          },
        );
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
mb-6
text-center
"
        >
          Create Account
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

        {success && (
          <div
            className="
bg-green-100
text-green-700
p-3
rounded
mb-4
"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="
w-full
border
p-3
rounded
"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="
w-full
border
p-3
rounded
"
            required
          />

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
              onClick={togglePasswordVisibility}
              className="
absolute
right-3
top-1/2
-transform
-translate-y-1/2
text-gray-600
hover:text-gray-800
"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="
w-full
border
p-3
rounded
"
          />

          <div>
            <label
              className="
block
mb-2
font-medium
"
            >
              Account Type
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="
w-full
border
p-3
rounded
"
            >
              <option value="">Select account type</option>

              <option value="student">Student</option>

              <option value="client">Client</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`

w-full

text-white

py-3

rounded

transition-colors


${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}

`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p
          className="
text-center
mt-5
"
        >
          Already have an account?
          <Link
            to="/login"
            state={{
              from,
            }}
            className="
text-blue-600
ml-2
hover:underline
"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
