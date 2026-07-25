import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Award } from "lucide-react";
import logoImg from "../assets/logo.png";
import { onAuthStateChanged, signOut } from "../firebase/config";
import { useToast } from "../context/ToastContext";
import StarButton from "./ui/star-button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showRegisterBtn, setShowRegisterBtn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowRegisterBtn(window.scrollY > 300);
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      showToast("Logged out successfully", "success");
      navigate("/");
      setIsOpen(false);
    } catch (err) {
      showToast("Logout failed: " + err.message, "error");
    }
  };

  const isActive = (path) => {
    if (path.startsWith("/#")) return location.hash === path.substring(1);
    return location.pathname === path && !location.hash;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Schedule", path: "/#schedule" },
    { name: "Rules & FAQs", path: "/#faqs" },
    { name: "Contact", path: "/#contact" }
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(9,13,22,0.92)"
          : "rgba(9,13,22,0.80)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.24)" : "none"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <div
              className="w-16 h-16 shrink-0 transition-all duration-300 group-hover:scale-110 flex items-center justify-center"
            >
              <img src={logoImg} alt="VSB Logo" className="w-full h-full object-contain" style={{ mixBlendMode: "screen" }} />
            </div>
            <span
              className="font-extrabold text-xl sm:text-2xl tracking-tight font-serif transition-all duration-300"
              style={{ color: "#FFFFFF" }}
            >
              VSB{" "}
              <span
                className="transition-all duration-300"
                style={{
                  color: "#F59E0B",
                  textShadow: "0 0 16px rgba(245,158,11,0.65)",
                  filter: "drop-shadow(0 0 8px rgba(245,158,11,0.5))"
                }}
              >
                Portal
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith("/#");
              const active = isActive(link.path);
              const linkClass = `relative px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-250 ${
                active
                  ? "text-white bg-white/[0.08]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.05]"
              }`;

              return isHash ? (
                <a
                  key={link.path}
                  href={link.path.substring(1)}
                  className={linkClass}
                >
                  {link.name}
                </a>
              ) : (
                <Link key={link.path} to={link.path} className={linkClass}>
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: "#06B6D4" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Scroll-triggered Register CTA */}
            <AnimatePresence>
              {showRegisterBtn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: 16 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: 16 }}
                  transition={{ duration: 0.25 }}
                  className="ml-2"
                >
                  <StarButton to="/events" variant="violet" className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                    Register Now
                  </StarButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin Controls */}
            {adminUser && location.pathname.startsWith("/admin") && (
              <div
                className="flex items-center gap-3 ml-3 pl-3"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-250"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818CF8"
                  }}
                >
                  <User className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-250"
                  style={{ color: "#F87171" }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <AnimatePresence>
              {showRegisterBtn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mr-1"
                >
                  <StarButton to="/events" variant="violet" className="px-3.5 py-1.5 text-[10px]">
                    Register
                  </StarButton>
                </motion.div>
              )}
            </AnimatePresence>

            {adminUser && location.pathname.startsWith("/admin") && (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-lg transition-all"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#818CF8"
                }}
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-all duration-250"
              style={{ color: "rgba(255,255,255,0.6)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(9,13,22,0.97)" }}
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isHash = link.path.startsWith("/#");
                const active = isActive(link.path);
                return isHash ? (
                  <a
                    key={link.path}
                    href={link.path.substring(1)}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200"
                    style={
                      active
                        ? {
                            background: "rgba(99,102,241,0.12)",
                            borderLeft: "3px solid #6366F1",
                            color: "#818CF8"
                          }
                        : { color: "rgba(255,255,255,0.55)" }
                    }
                  >
                    {link.name}
                  </Link>
                );
              })}

              {adminUser && location.pathname.startsWith("/admin") && (
                <div className="pt-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background: "rgba(99,102,241,0.12)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      color: "#818CF8"
                    }}
                  >
                    <User className="w-4 h-4" /> Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all"
                    style={{ color: "#F87171" }}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
