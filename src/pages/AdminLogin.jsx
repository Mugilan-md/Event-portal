import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, UserPlus, LogIn, KeyRound } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, checkAdminExists, registerFirstAdmin } from "../firebase/config";
import { useToast } from "../context/ToastContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const initCheck = async () => {
      try {
        const adminExists = await checkAdminExists();
        setIsAdminSetup(!adminExists);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initCheck();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Email and password are required.", "error");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(email, password);
      showToast("Admin authenticated successfully", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Authentication failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    try {
      setLoading(true);
      const creds = await createUserWithEmailAndPassword(email, password);
      const user = creds.user;
      await registerFirstAdmin(email, user.uid);
      showToast("Admin account initialized successfully!", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Admin setup failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !email) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-purple-300 text-sm font-semibold tracking-wider animate-pulse">
          VERIFYING ACCESS STATUS...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030014] flex items-center justify-center px-4 overflow-hidden py-16">
      {/* Glow Rings */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Shield Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isAdminSetup ? "Initialize Master Admin" : "Admin Panel Login"}
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {isAdminSetup 
              ? "No administrator account detected in Firestore. Set up your master keys below."
              : "Private dashboard control deck. Unauthorized accesses are logged."
            }
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/20 shadow-2xl">
          {isAdminSetup ? (
            // Create Admin Form
            <form onSubmit={handleSetup} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" /> Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. administrator@portal.com"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" /> Choose Secure Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" /> Re-enter Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Create Master Admin
              </button>
            </form>
          ) : (
            // Standard Sign In Form
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" /> Account Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" /> Account Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Authenticate Securely
              </button>
            </form>
          )}
        </div>

        {/* Demo Indicator helper */}
        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/10 text-[10px] text-center text-gray-500 leading-normal">
          Demo Default Credentials (if mock fallback active): <br />
          Email: <span className="text-blue-400 font-semibold">admin@portal.com</span> • Password: <span className="text-blue-400 font-semibold">admin123</span>
        </div>
      </div>
    </div>
  );
}
