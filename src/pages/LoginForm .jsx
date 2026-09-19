import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const API_BASE = "https://pressai.info/api"; // Base Flask API URL
const API_BASE = "https://pressai.info/api"; // Base Flask API URL

const demoCredentials = {
  email: "test@gmail.com",
  password: "test123",
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = async (field) => {
    const value = demoCredentials[field];

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setMessageType("");

    try {
      const res = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user?.email || formData.email);
        setMessage("✓ Login successful...");
        setMessageType("success");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.error || "Invalid credentials");
        setMessageType("error");
      }

      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessage("✕ Server error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          <p className="font-semibold">Demo Login</p>
          <p className="mt-1">This project is on demo purpose now. Use this account to log in.</p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white/60 px-2 py-1.5">
              <span><span className="font-medium">Email:</span> {demoCredentials.email}</span>
              <button
                type="button"
                onClick={() => handleCopy("email")}
                className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-colors"
              >
                {copiedField === "email" ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white/60 px-2 py-1.5">
              <span><span className="font-medium">Password:</span> {demoCredentials.password}</span>
              <button
                type="button"
                onClick={() => handleCopy("password")}
                className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-colors"
              >
                {copiedField === "password" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                ✉
              </span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔐
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-md transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className="absolute top-26 right-2">
            <div
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : messageType === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : ""
              }`}
              role="alert"
            >
              {message}
            </div>
          </div>
        )}

        {/* Sign Up Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-700">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/user-register")}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline focus:outline-none"
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
