import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = ({ setPage }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      setPage("home");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#E3E8EE] overflow-hidden">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-[#0D6EFD] to-[#005ADE] px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-[0.06] rounded-full -mr-12 -mt-12"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-[0.06] rounded-full -ml-8 -mb-8"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
              <p className="text-white/70 text-sm">Sign in to your account to continue</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/10 transition-all bg-[#F7FAFC] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD]/10 transition-all bg-[#F7FAFC] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B96A5] hover:text-[#1C1C1C] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0D6EFD] to-[#005ADE] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#0D6EFD]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-[#8B96A5]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setPage("signup")}
                  className="text-[#0D6EFD] font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-[#F0F7FF] border border-[#D1E9FF] rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-[#0D6EFD] mb-2">Demo Credentials</p>
          <div className="flex justify-center gap-6 text-xs text-[#505050]">
            <div>
              <span className="font-semibold">Admin:</span> admin@ecommerce.com / admin123
            </div>
            <div>
              <span className="font-semibold">User:</span> user@ecommerce.com / user123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
