import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, UserPlus, LogIn, KeyRound, BookOpen, GraduationCap, Scroll, Calendar, Zap } from "lucide-react";
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
    if (!email.trim() || !password.trim()) { showToast("Email and password are required.", "error"); return; }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(email, password);
      showToast("Admin authenticated successfully", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Authentication failed: " + err.message, "error");
    } finally { setLoading(false); }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) { showToast("Please fill in all fields.", "error"); return; }
    if (password !== confirmPassword) { showToast("Passwords do not match.", "error"); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters.", "error"); return; }
    try {
      setLoading(true);
      const creds = await createUserWithEmailAndPassword(email, password);
      await registerFirstAdmin(email, creds.user.uid);
      showToast("Admin account initialized successfully!", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Admin setup failed: " + err.message, "error");
    } finally { setLoading(false); }
  };

  if (loading && !email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#090D16" }}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 animate-spin" style={{ borderColor: "transparent", borderTopColor: "#6366F1", borderRightColor: "#6366F1" }} />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 animate-spin [animation-direction:reverse]" style={{ borderColor: "transparent", borderBottomColor: "#06B6D4", borderLeftColor: "#06B6D4" }} />
        </div>
        <p className="text-sm font-semibold tracking-widest uppercase animate-pulse" style={{ color: "#6366F1" }}>
          Verifying Access Status...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden" style={{ background: "#090D16" }}>

      {/* ── LEFT HERO PANEL (Deep Charcoal, premium dark SaaS) ── */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 min-h-[40vh] md:min-h-screen overflow-hidden">
        {/* Violet glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(99,102,241,0.18)" }} />
        {/* Cyan glow orb */}
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full blur-[80px] pointer-events-none" style={{ background: "rgba(6,182,212,0.1)" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Brand badge */}
        <div
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "#818CF8"
          }}
        >
          <Zap className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
          Admin Access Portal
        </div>

        {/* 3D Floating Image */}
        <motion.div
          animate={{ y: [-12, 12, -12] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative w-full max-w-md z-10 aspect-square"
        >
          <img src={login3dImg} alt="3D Campus Digital Gateway" className="w-full h-full object-contain drop-shadow-2xl" />

          {/* Orbiting icon cards */}
          <motion.div
            animate={{ x: [0, 20, 0, -20, 0], y: [0, -20, 0, 20, 0], rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute top-[15%] left-[10%] w-14 h-14 rounded-2xl flex items-center justify-center z-20"
            style={{ background: "rgba(99,102,241,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 20px rgba(99,102,241,0.2)" }}
          >
            <GraduationCap className="w-6 h-6" style={{ color: "#F59E0B" }} />
          </motion.div>

          <motion.div
            animate={{ x: [0, -15, 0, 15, 0], y: [0, 15, 0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear", delay: 1 }}
            className="absolute top-[30%] right-[10%] w-12 h-12 rounded-2xl flex items-center justify-center z-20"
            style={{ background: "rgba(6,182,212,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(6,182,212,0.3)", boxShadow: "0 0 16px rgba(6,182,212,0.2)" }}
          >
            <BookOpen className="w-5 h-5" style={{ color: "#06B6D4" }} />
          </motion.div>

          <motion.div
            animate={{ rotateY: 360, y: [-10, 10, -10] }}
            transition={{ rotateY: { repeat: Infinity, duration: 6, ease: "linear" }, y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
            className="absolute bottom-[25%] left-[15%] w-16 h-16 rounded-xl flex items-center justify-center z-20"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(79,70,229,0.4))", border: "1px solid rgba(99,102,241,0.4)", boxShadow: "0 0 24px rgba(99,102,241,0.3)" }}
          >
            <Scroll className="w-7 h-7" style={{ color: "#F59E0B" }} />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[15%] right-[15%] w-14 h-14 rounded-xl flex items-center justify-center z-20"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Calendar className="w-6 h-6 text-white" style={{ opacity: 0.7 }} />
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-10"
        style={{ background: "#FAFAFC" }}
      >
        <div className="max-w-md w-full space-y-8">

          {/* Heading */}
          <div className="space-y-3">
            <div
              className="inline-flex p-3 rounded-2xl"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Shield className="w-8 h-8" style={{ color: "#6366F1" }} />
            </div>
            <h1 className="text-3xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
              {isAdminSetup ? "Initialize Master Admin" : "Admin Dashboard Login"}
            </h1>
            <p className="text-sm" style={{ color: "#64748B" }}>
              {isAdminSetup
                ? "No administrator account detected. Set up your master credentials below."
                : "Enter your credentials to access the central campus management portal."}
            </p>
          </div>

          {/* Form Card */}
          <div
            className="p-8 rounded-3xl"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 30px rgba(9,13,22,0.06), 0 0 0 1px rgba(99,102,241,0.04)"
            }}
          >
            {isAdminSetup ? (
              <form onSubmit={handleSetup} className="space-y-5">
                {[
                  { label: "Admin Email Address", type: "email", value: email, setter: setEmail, placeholder: "e.g. admin@university.edu", Icon: Mail },
                  { label: "Secure Password", type: "password", value: password, setter: setPassword, placeholder: "Minimum 6 characters", Icon: Lock },
                  { label: "Re-enter Password", type: "password", value: confirmPassword, setter: setConfirmPassword, placeholder: "Confirm password", Icon: KeyRound }
                ].map(({ label, type, value, setter, placeholder, Icon }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: "#94A3B8" }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: "#6366F1" }} /> {label}
                    </label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  style={{ background: "#6366F1", color: "white", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#4F46E5"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#6366F1"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.3)"; }}
                >
                  <UserPlus className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  Initialize Account
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                {[
                  { label: "Account Email", type: "email", value: email, setter: setEmail, placeholder: "Enter admin email address", Icon: Mail },
                  { label: "Account Password", type: "password", value: password, setter: setPassword, placeholder: "Enter account password", Icon: Lock }
                ].map(({ label, type, value, setter, placeholder, Icon }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: "#94A3B8" }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: "#6366F1" }} /> {label}
                    </label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  style={{ background: "#6366F1", color: "white", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#4F46E5"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#6366F1"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.3)"; }}
                >
                  <LogIn className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  Access Portal
                </button>
              </form>
            )}
          </div>

          {/* Demo info box */}
          <div
            className="p-4 rounded-xl text-xs text-center leading-relaxed"
            style={{
              background: "rgba(99,102,241,0.04)",
              border: "1px solid rgba(99,102,241,0.1)",
              color: "#64748B"
            }}
          >
            Authorized Personnel Only.<br />
            Demo Email:{" "}
            <span className="font-bold" style={{ color: "#6366F1" }}>admin@portal.com</span>
            {" "}• Pass:{" "}
            <span className="font-bold" style={{ color: "#6366F1" }}>admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
