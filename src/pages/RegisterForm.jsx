import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://pressai.info/api/register";

const InputField = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <label className="flex flex-col gap-2 text-gray-800">
    <span className="text-sm font-semibold">
      {label} <span className="text-red-500">*</span>
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    />
  </label>
);

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Registration failed");
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user?.email) localStorage.setItem("email", data.user.email);

      alert("Registered successfully!");
      navigate("/dashboard");
    } catch {
      alert("Network error: could not connect to the registration server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-2xl shadow-blue-100/50 backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Qalib</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Create your account</h1>
          <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
            Register with your name, email, and password. The backend validates these fields and
            returns your session token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <InputField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <label className="flex flex-col gap-2 text-gray-800">
            <span className="text-sm font-semibold">
              Role <span className="text-red-500">*</span>
            </span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="user">User</option>
            </select>
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
