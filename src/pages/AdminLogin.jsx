import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, UserPlus, LogIn, KeyRound, BookOpen, GraduationCap, Scroll, Calendar } from "lucide-react";
import login3dImg from "../assets/login-3d.png";
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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
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
    <div className="relative min-h-screen bg-[#F9F5EF] flex flex-col md:flex-row overflow-hidden">
      {/* Left Hero Section (3D Digital Campus Gate) */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center bg-[#FAFAFA] p-8 min-h-[40vh] md:min-h-screen overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4338CA]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F59E0B]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* 3D Main Graphic */}
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative w-full max-w-lg z-10 aspect-square"
        >
          <img 
            src={login3dImg} 
            alt="3D Campus Digital Gateway" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />

          {/* Orbiting Icons */}
          {/* Graduation Cap */}
          <motion.div
            animate={{ 
              x: [0, 20, 0, -20, 0],
              y: [0, -20, 0, 20, 0],
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute top-[15%] left-[10%] w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-[#F59E0B]/30 flex items-center justify-center z-20"
          >
            <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
          </motion.div>

          {/* Book Open */}
          <motion.div
            animate={{ 
              x: [0, -15, 0, 15, 0],
              y: [0, 15, 0, -15, 0],
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear", delay: 1 }}
            className="absolute top-[30%] right-[10%] w-12 h-12 bg-[#4338CA]/50 backdrop-blur-md rounded-2xl shadow-xl border border-[#4338CA]/50 flex items-center justify-center z-20"
          >
            <BookOpen className="w-5 h-5 text-white" />
          </motion.div>

          {/* Scroll */}
          <motion.div
            animate={{ 
              rotateY: 360,
              y: [-10, 10, -10]
            }}
            transition={{ 
              rotateY: { repeat: Infinity, duration: 6, ease: "linear" },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
            className="absolute bottom-[25%] left-[15%] w-16 h-16 bg-gradient-to-br from-[#4338CA] to-[#312e81] rounded-xl shadow-[0_0_20px_rgba(31,60,136,0.5)] border border-[#F59E0B]/50 flex items-center justify-center z-20"
          >
            <Scroll className="w-7 h-7 text-[#F59E0B]" />
          </motion.div>

          {/* Calendar */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[15%] right-[15%] w-14 h-14 bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 flex items-center justify-center z-20"
          >
            <Calendar className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="max-w-md w-full space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-[#4338CA]/10 border border-[#4338CA]/20 text-[#4338CA]">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#111827] font-serif">
              {isAdminSetup ? "Initialize Master Admin" : "Admin Dashboard Login"}
            </h1>
            <p className="text-sm text-gray-600">
              {isAdminSetup 
                ? "No administrator account detected in Firestore. Set up your master keys below."
                : "Enter your credentials to access the central campus management portal."
              }
            </p>
          </div>

          {/* Form Card */}
          <div className="p-8 rounded-3xl bg-white border border-[#F59E0B]/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {isAdminSetup ? (
              // Create Admin Form
              <form onSubmit={handleSetup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#4338CA]" /> Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@university.edu"
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#111827] placeholder-gray-400 text-sm focus:outline-none focus:border-[#4338CA] focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#4338CA]" /> Secure Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#111827] placeholder-gray-400 text-sm focus:outline-none focus:border-[#4338CA] focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#4338CA]" /> Re-enter Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#111827] placeholder-gray-400 text-sm focus:outline-none focus:border-[#4338CA] focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#4338CA] hover:bg-[#312e81] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 border border-[#F59E0B]/30"
                >
                  <UserPlus className="w-4 h-4 text-[#F59E0B]" /> Initialize Account
                </button>
              </form>
            ) : (
              // Standard Sign In Form
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#4338CA]" /> Account Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email address"
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#111827] placeholder-gray-400 text-sm focus:outline-none focus:border-[#4338CA] focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#4338CA]" /> Account Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#111827] placeholder-gray-400 text-sm focus:outline-none focus:border-[#4338CA] focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#4338CA] hover:bg-[#312e81] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 border border-[#F59E0B]/30"
                >
                  <LogIn className="w-4 h-4 text-[#F59E0B]" /> Access Portal
                </button>
              </form>
            )}
          </div>

          {/* Demo Indicator */}
          <div className="p-4 rounded-xl bg-[#4338CA]/5 border border-[#4338CA]/10 text-xs text-center text-gray-500 leading-relaxed shadow-inner">
            Authorized Personnel Only. <br />
            Demo Email: <span className="text-[#4338CA] font-bold">admin@portal.com</span> • Pass: <span className="text-[#4338CA] font-bold">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
