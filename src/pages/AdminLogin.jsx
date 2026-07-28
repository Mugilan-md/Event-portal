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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#070B14] text-white relative overflow-hidden font-admin-body">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-2xl animate-pulse">
          <Shield className="w-8 h-8 text-indigo-400" />
        </div>
        <p className="text-xs font-mono tracking-widest text-indigo-400 uppercase font-bold animate-pulse">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#070B14] text-slate-100 font-admin-body selection:bg-indigo-500/30">
      
      {/* ── TOP HEADER BAR ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <img src={logoImg} alt="VSB Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              VSB <span className="text-indigo-400">Portal</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Control Center</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{time.toLocaleTimeString()}</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      {/* ── MAIN SIGN IN CARD CONTAINER ── */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <Card3D depth={25} maxTilt={8} className="w-full">
          <div className="relative rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-8 sm:p-10 text-left overflow-hidden">
            
            {/* Top Glowing Accent Line */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />

            {/* Header Emblem & Title */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <Icon3D icon={Shield} size="lg" color="violet" />
                <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AUTH GATEWAY
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-syne tracking-tight">
                  {isAdminSetup ? "Setup Primary Admin" : "Admin Sign In"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
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
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Admin Email
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@vsb.edu"
                    className="w-full px-4 py-3 bg-slate-950/80 rounded-xl text-sm text-white placeholder-slate-500 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-950/80 rounded-xl text-sm text-white placeholder-slate-500 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Only on first setup) */}
              {isAdminSetup && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Confirm Password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-950/80 rounded-xl text-sm text-white placeholder-slate-500 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isAdminSetup ? "Create Admin Account" : "Sign In to Admin Console"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              {/* Quick Fill Demo Credentials */}
              {!isAdminSetup && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={fillDemoCreds}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auto-fill Demo Credentials
                  </button>
                </div>
              )}
            </form>
          </div>
        </Card3D>
      </main>

      {/* ── FOOTER STATUS BAR ── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5">
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
