import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  KeyRound,
  BookOpen,
  GraduationCap,
  Scroll,
  Calendar,
  Zap,
  Activity,
  Cpu,
  Globe,
  Server,
  Database,
  ArrowRight,
  Sparkles,
  Clock,
  Fingerprint,
  Layers,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";
import login3dImg from "../assets/login-3d.png";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  checkAdminExists,
  registerFirstAdmin
} from "../firebase/config";
import { useToast } from "../context/ToastContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  // Parallax mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 16;
    const y = (clientY / window.innerHeight - 0.5) * 16;
    setMousePos({ x, y });
  };

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
      await registerFirstAdmin(email, creds.user.uid);
      showToast("Admin account initialized successfully!", "success");
      navigate("/admin-dashboard");
    } catch (err) {
      showToast("Admin setup failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setEmail("admin@portal.com");
    setPassword("admin123");
    showToast("Demo credentials filled into form", "info");
  };

  if (loading && !email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#050816] text-white relative overflow-hidden select-none">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
          <div className="absolute inset-3 rounded-full border-b-2 border-l-2 border-cyan-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <Shield className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-indigo-400 font-semibold animate-pulse">
            [ SECURE AI CONTROL NODE ]
          </p>
          <p className="text-sm text-slate-400 font-medium">
            Verifying Master Credentials & Encryption Protocols...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-[#050816] text-slate-100 font-sans select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          CANVAS & CINEMATIC ANIMATED BACKGROUND
         ───────────────────────────────────────────────────────────── */}
      {/* Aurora Ambient Lighting Blobs */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.15, 0.95, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-600/15 to-transparent blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-cyan-500/20 via-blue-600/15 to-transparent blur-[160px] pointer-events-none"
      />
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
      />

      {/* Cybernetic Grid & Neural Nodes Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
              scale: Math.random() * 0.6 + 0.4
            }}
            animate={{
              y: ["-10%", "110%"],
              opacity: [0.1, 0.6, 0.1]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"
          />
        ))}
      </div>

      {/* TOP HEADER STATUS BAR */}
      <header className="absolute top-0 inset-x-0 h-16 px-6 lg:px-12 flex items-center justify-between z-30 border-b border-slate-800/40 bg-[#050816]/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-[#09111F] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                V.S.B. AI Portal
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full uppercase">
                v2.6.4 PROD
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Collegiate Campus Management Core
            </p>
          </div>
        </div>

        {/* Live Clock & Security Status */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {time.toLocaleTimeString()} • {time.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-semibold tracking-wide uppercase">
              System Online
            </span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTAINER (2-COLUMN HERO + LOGIN)
         ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 min-h-screen flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ─────────────────────────────────────────────────────────
              LEFT COLUMN: 3D PARALLAX AI HERO SECTION
             ───────────────────────────────────────────────────────── */}
          <motion.div
            style={{
              rotateX: mousePos.y * -0.5,
              rotateY: mousePos.x * 0.5
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="lg:col-span-6 relative flex flex-col justify-center items-center lg:items-start text-center lg:text-left py-6"
          >
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Enterprise AI Control Center</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4"
            >
              Autonomous Security &{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                Campus Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-400 max-w-lg mb-8 leading-relaxed"
            >
              Centralized administrative gateway for real-time hackathon management, student verification credentials, and automated event analytics.
            </motion.p>

            {/* 3D HOLOGRAPHIC GRAPHIC COMPOSITION */}
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center my-4">
              
              {/* Outer Glowing Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-dashed border-indigo-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 rounded-full border border-cyan-500/25"
              />

              {/* Main Center Image inside 3D Hologram frame */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 rounded-3xl p-1 bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-cyan-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)]"
              >
                <div className="w-full h-full bg-[#09111F]/90 rounded-[22px] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                  <img
                    src={login3dImg}
                    alt="AI Security Node"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(99,102,241,0.5)] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09111F] via-transparent to-transparent opacity-60" />
                  
                  {/* Hologram Bottom Label */}
                  <div className="absolute bottom-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>AES-256 ENCRYPTED GATEWAY</span>
                  </div>
                </div>
              </motion.div>

              {/* ORBITING 3D GLASS BADGES */}
              
              {/* Badge 1: Neural Health */}
              <motion.div
                animate={{
                  x: [0, 15, 0, -15, 0],
                  y: [0, -15, 0, 15, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-2 z-20 px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">AI Neural Core</p>
                  <p className="text-xs font-bold text-white">100% Operational</p>
                </div>
              </motion.div>

              {/* Badge 2: Student Sync */}
              <motion.div
                animate={{
                  x: [0, -15, 0, 15, 0],
                  y: [0, 15, 0, -15, 0]
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 right-0 z-20 px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Live Records</p>
                  <p className="text-xs font-bold text-amber-400">Syncing Campus Data</p>
                </div>
              </motion.div>

              {/* Badge 3: Cloud Vault */}
              <motion.div
                animate={{
                  y: [-12, 12, -12]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-4 left-6 z-20 px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Database className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Cloud Database</p>
                  <p className="text-xs font-bold text-slate-200">Firebase Firestore</p>
                </div>
              </motion.div>

              {/* Badge 4: Security Shield */}
              <motion.div
                animate={{
                  x: [0, 12, -12, 0],
                  y: [0, -10, 10, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 right-2 z-20 px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Auth Level</p>
                  <p className="text-xs font-bold text-emerald-400">Master Level 5</p>
                </div>
              </motion.div>
            </div>

            {/* Bottom Enterprise Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 grid grid-cols-3 gap-4 w-full max-w-md pt-4 border-t border-slate-800/60"
            >
              <div className="text-left">
                <p className="text-xs font-bold text-white">99.99%</p>
                <p className="text-[10px] text-slate-400 font-mono">Uptime SLA</p>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-indigo-400">256-Bit</p>
                <p className="text-[10px] text-slate-400 font-mono">SSL Encrypted</p>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-cyan-400">Zero-Trust</p>
                <p className="text-[10px] text-slate-400 font-mono">Architecture</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ─────────────────────────────────────────────────────────
              RIGHT COLUMN: ULTRA-PREMIUM GLASS LOGIN CARD
             ───────────────────────────────────────────────────────── */}
          <motion.div
            style={{
              rotateX: mousePos.y * 0.4,
              rotateY: mousePos.x * -0.4
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="lg:col-span-6 w-full max-w-lg mx-auto"
          >
            {/* Card Outer Glow Border Container */}
            <div className="relative p-0.5 rounded-[30px] bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(99,102,241,0.2)]">
              
              {/* Animated Top Border Sweep Effect */}
              <div className="absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] animate-pulse" />

              {/* Main Card Body */}
              <div className="relative w-full bg-[#09111F]/90 backdrop-blur-3xl rounded-[28px] p-6 sm:p-10 text-left overflow-hidden border border-white/10">
                
                {/* Decorative Subtle Grid Lines inside card */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Title & Icon Header */}
                <div className="relative z-10 mb-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      SECURE AUTH SESSION
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {isAdminSetup ? "Initialize Master Admin" : "Admin Dashboard Login"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {isAdminSetup
                        ? "No administrator account detected. Setup primary credentials below."
                        : "Enter authorized credentials to enter the campus control portal."}
                    </p>
                  </div>
                </div>

                {/* FORM IMPLEMENTATION */}
                <div className="relative z-10">
                  {isAdminSetup ? (
                    <form onSubmit={handleSetup} className="space-y-5">
                      {/* Email Field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" /> Admin Email Address
                          </span>
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 p-0.5 ${
                            activeInput === "email"
                              ? "bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                              : "bg-slate-800/60 hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="email"
                            value={email}
                            onFocus={() => setActiveInput("email")}
                            onBlur={() => setActiveInput(null)}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@vsb.edu"
                            className="w-full px-4 py-3.5 bg-[#050816]/90 rounded-[10px] text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Secure Password
                          </span>
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 p-0.5 ${
                            activeInput === "password"
                              ? "bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                              : "bg-slate-800/60 hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onFocus={() => setActiveInput("password")}
                            onBlur={() => setActiveInput(null)}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full px-4 py-3.5 bg-[#050816]/90 rounded-[10px] text-sm text-white placeholder-slate-500 focus:outline-none transition-all pr-10"
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

                      {/* Confirm Password Field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Confirm Password
                          </span>
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 p-0.5 ${
                            activeInput === "confirmPassword"
                              ? "bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                              : "bg-slate-800/60 hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type={showPass ? "text" : "password"}
                            value={confirmPassword}
                            onFocus={() => setActiveInput("confirmPassword")}
                            onBlur={() => setActiveInput(null)}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full px-4 py-3.5 bg-[#050816]/90 rounded-[10px] text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Submit Setup Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-4 rounded-xl font-bold text-sm text-white overflow-hidden shadow-[0_0_25px_rgba(99,102,241,0.4)] group transition-all"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 group-hover:opacity-90 transition-opacity" />
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Initializing Master Admin...</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 text-amber-400" />
                              <span>Initialize Master Admin</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </motion.button>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-5">
                      {/* Email Field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" /> Account Email
                          </span>
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 p-0.5 ${
                            activeInput === "email"
                              ? "bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                              : "bg-slate-800/60 hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="email"
                            value={email}
                            onFocus={() => setActiveInput("email")}
                            onBlur={() => setActiveInput(null)}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                            className="w-full px-4 py-3.5 bg-[#050816]/90 rounded-[10px] text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
                          </span>
                        </label>
                        <div
                          className={`relative rounded-xl transition-all duration-300 p-0.5 ${
                            activeInput === "password"
                              ? "bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                              : "bg-slate-800/60 hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onFocus={() => setActiveInput("password")}
                            onBlur={() => setActiveInput(null)}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter account password"
                            className="w-full px-4 py-3.5 bg-[#050816]/90 rounded-[10px] text-sm text-white placeholder-slate-500 focus:outline-none transition-all pr-10"
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

                      {/* Submit Login Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-4 rounded-xl font-bold text-sm text-white overflow-hidden shadow-[0_0_25px_rgba(99,102,241,0.4)] group transition-all mt-2"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 group-hover:opacity-90 transition-opacity" />
                        
                        {/* Light sweep animation */}
                        <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

                        <div className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Authenticating Credentials...</span>
                            </>
                          ) : (
                            <>
                              <LogIn className="w-4 h-4 text-amber-400" />
                              <span>Access Admin Portal</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                            </>
                          )}
                        </div>
                      </motion.button>
                    </form>
                  )}
                </div>

                {/* DEMO CREDENTIALS QUICK FILL BOX */}
                {!isAdminSetup && (
                  <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="text-left text-slate-400">
                      <p className="font-mono text-[10px] text-slate-500 uppercase">Authorized Personnel Only</p>
                      <p className="text-slate-300">
                        Demo: <span className="text-indigo-400 font-mono font-bold">admin@portal.com</span> • <span className="text-cyan-400 font-mono font-bold">admin123</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={fillDemoCreds}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Auto Fill
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-6 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-indigo-400" /> V.S.B. Core Cloud
              </span>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
