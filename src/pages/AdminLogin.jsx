import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
  KeyRound,
  ArrowRight,
  Sparkles,
  Clock,
  Fingerprint,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  checkAdminExists,
  registerFirstAdmin
} from "../firebase/config";
import { useToast } from "../context/ToastContext";
import Card3D from "../components/ui/Card3D";
import Icon3D from "../components/ui/Icon3D";
import logoImg from "../assets/logo.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic live clock
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      setSubmitting(true);
      await signInWithEmailAndPassword(email, password);
      showToast("Admin authenticated successfully", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Authentication failed: " + err.message, "error");
    } finally {
      setSubmitting(false);
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
      setSubmitting(true);
      const creds = await createUserWithEmailAndPassword(email, password);
      await registerFirstAdmin(email, creds.user.uid);
      showToast("Admin account initialized successfully!", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Admin setup failed: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCreds = () => {
    setEmail("admin@portal.com");
    setPassword("admin123");
    showToast("Demo credentials filled", "info");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#14110E] text-white relative overflow-hidden font-admin-body">
        <div className="w-16 h-16 rounded-2xl bg-[#664930]/40 border border-[#997E67] flex items-center justify-center shadow-2xl animate-pulse">
          <Shield className="w-8 h-8 text-[#FFDBBB]" />
        </div>
        <p className="text-xs font-mono tracking-widest text-[#FFDBBB] uppercase font-bold animate-pulse">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#14110E] text-[#FFDBBB] font-admin-body selection:bg-[#FFDBBB]/30">
      
      {/* ── TOP HEADER BAR ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#664930] border border-[#997E67] p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <img src={logoImg} alt="VSB Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              VSB <span className="text-[#FFDBBB]">Portal</span>
            </span>
            <span className="text-[10px] text-[#CCBEB1] font-mono">Control Center</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#664930]/60 border border-[#997E67] text-[#FFDBBB] shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#FFDBBB]" />
            <span>{time.toLocaleTimeString()}</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#664930]/40 hover:bg-[#664930] border border-[#997E67] text-[#FFDBBB] text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      {/* ── MAIN SIGN IN CARD CONTAINER ── */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <Card3D depth={25} maxTilt={8} className="w-full">
          <div className="relative rounded-3xl bg-[#664930]/90 backdrop-blur-2xl border border-[#997E67] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-8 sm:p-10 text-left overflow-hidden">
            
            {/* Top Glowing Accent Line */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-[#FFDBBB] via-[#997E67] to-[#FFDBBB] shadow-[0_0_12px_rgba(255,219,187,0.8)]" />

            {/* Header Emblem & Title */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <Icon3D icon={Shield} size="lg" color="gold" />
                <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AUTH GATEWAY
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFDBBB] font-syne tracking-tight">
                  {isAdminSetup ? "Setup Primary Admin" : "Admin Sign In"}
                </h1>
                <p className="text-xs sm:text-sm text-[#CCBEB1] mt-1 leading-relaxed">
                  {isAdminSetup
                    ? "Initialize your primary administrator credentials below."
                    : "Enter your secure credentials to access management console."}
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={isAdminSetup ? handleSetup : handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#FFDBBB] flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#FFDBBB]" /> Admin Email
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@vsb.edu"
                    className="w-full px-4 py-3 bg-[#14110E] rounded-xl text-sm text-white placeholder-[#CCBEB1]/50 border border-[#997E67] focus:border-[#FFDBBB] focus:ring-2 focus:ring-[#FFDBBB]/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#FFDBBB] flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#FFDBBB]" /> Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#14110E] rounded-xl text-sm text-white placeholder-[#CCBEB1]/50 border border-[#997E67] focus:border-[#FFDBBB] focus:ring-2 focus:ring-[#FFDBBB]/20 focus:outline-none transition-all pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#CCBEB1] hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Only on first setup) */}
              {isAdminSetup && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#FFDBBB] flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-[#FFDBBB]" /> Confirm Password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#14110E] rounded-xl text-sm text-white placeholder-[#CCBEB1]/50 border border-[#997E67] focus:border-[#FFDBBB] focus:ring-2 focus:ring-[#FFDBBB]/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#FFDBBB] hover:bg-white text-[#664930] font-extrabold text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#664930]/30 border-t-[#664930] animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isAdminSetup ? "Create Admin Account" : "Sign In to Admin Console"}
                    <ArrowRight className="w-4 h-4 text-[#664930]" />
                  </span>
                )}
              </button>

              {/* Quick Fill Demo Credentials */}
              {!isAdminSetup && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={fillDemoCreds}
                    className="text-xs text-[#FFDBBB] hover:text-white font-bold inline-flex items-center gap-1.5 transition-colors underline"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFDBBB]" /> Auto-fill Demo Credentials
                  </button>
                </div>
              )}
            </form>
          </div>
        </Card3D>
      </main>

      {/* ── FOOTER STATUS BAR ── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#CCBEB1] font-mono flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#997E67]/30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL Encrypted Enterprise Auth</span>
        </div>
        <div>
          <span>V.S.B. Engineering College Portal © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
