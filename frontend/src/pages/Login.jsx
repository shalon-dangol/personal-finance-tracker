import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
// Import only the icons you need (tree-shakable)
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Wallet,
  Building2,
  Key,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

// --- Feature Item Component ---
function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/30 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
        <p className="text-indigo-200 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// --- Left Panel Component ---
function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 p-12 xl:p-16 flex-col justify-center overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
          Master your money with precision.
        </h1>

        <p className="text-indigo-200 text-base leading-relaxed mb-10">
          Join thousands of users who have transformed their financial health
          with WalletWise's institutional-grade tracking and insights.
        </p>

        <div className="space-y-8">
          <FeatureItem
            icon={RefreshCw}
            title="Real-time Sync"
            description="Connect your accounts and see your transactions update instantly across all devices."
          />
          <FeatureItem
            icon={Sparkles}
            title="Smart Categorization"
            description="AI-powered tracking that automatically organizes your spending patterns."
          />
          <FeatureItem
            icon={ShieldCheck}
            title="Bank-Grade Security"
            description="Your data is protected by industry-leading 256-bit encryption and multi-factor auth."
          />
        </div>
      </div>
    </div>
  );
}

// --- Login Form Component ---
function LoginForm() {
  const { login, register } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (activeTab === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-screen lg:min-h-0">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wallet className="w-6 h-6 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">WalletWise</span>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === "signup"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Please wait..."
                : activeTab === "login"
                ? "Login"
                : "Sign Up"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-xs text-gray-500 font-medium uppercase tracking-wide">
              or continue with
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Bank</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Key className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Passkey</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Protected by WalletWise institutional-grade encryption.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Privacy Policy
            </a>{" "}
            •{" "}
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function Login() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <LeftPanel />
      <LoginForm />
    </div>
  );
}
