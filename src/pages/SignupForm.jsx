import { useState } from "react";

const API_BASE = "https://qalib.cloud/api";

const SignupForm = ({ setMessage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ new state for behavior questions
  const [behaviorData, setBehaviorData] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          behavior_data: behaviorData, // ✅ send behavior data
        }),
      });

      if (!res.ok) {
        console.error("Failed response:", res.status, await res.text());
        setMessage("Registration failed. Please check server logs.");
        return;
      }

      const data = await res.json();
      console.log(data);

      if (data.token) {
        localStorage.setItem("email", formData.email);
        localStorage.setItem("token", data.token);
        setMessage("Registration successful!");
        setTimeout(() => setMessage(""), 3000);
        // window.location.href = "/dashboard";
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
      >
        {loading ? "Please wait..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;
