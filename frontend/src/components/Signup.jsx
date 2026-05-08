import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Signup = ({ setPage }) => {
  const { signup, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await signup(name, email, password);
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
          <div className="bg-gradient-to-r from-[#00B517] to-[#009415] px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-[0.06] rounded-full -mr-12 -mt-12"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-[0.06] rounded-full -ml-8 -mb-8"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-white/70 text-sm">Join us and start shopping today</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#00B517] focus:ring-2 focus:ring-[#00B517]/10 transition-all bg-[#F7FAFC] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#00B517] focus:ring-2 focus:ring-[#00B517]/10 transition-all bg-[#F7FAFC] focus:bg-white"
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
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-12 pr-12 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#00B517] focus:ring-2 focus:ring-[#00B517]/10 transition-all bg-[#F7FAFC] focus:bg-white"
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

            <div>
              <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B96A5]" />
                <input
                  id="signup-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-12 pr-4 py-3.5 border border-[#DEE2E7] rounded-xl text-sm outline-none focus:border-[#00B517] focus:ring-2 focus:ring-[#00B517]/10 transition-all bg-[#F7FAFC] focus:bg-white"
                />
              </div>
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00B517] to-[#009415] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#00B517]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <p className="text-sm text-[#8B96A5]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setPage("login")}
                  className="text-[#0D6EFD] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
