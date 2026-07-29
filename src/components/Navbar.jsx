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

  const isAdminPage = location.pathname.includes("admin");

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
        background: isAdminPage
          ? "#FFDBBB"
          : (scrolled ? "rgba(9,13,22,0.95)" : "rgba(9,13,22,0.85)"),
        backdropFilter: isAdminPage ? "none" : "blur(20px) saturate(180%)",
        WebkitBackdropFilter: isAdminPage ? "none" : "blur(20px) saturate(180%)",
        borderBottom: isAdminPage
          ? "2px solid #664930"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: isAdminPage
          ? "0 4px 20px rgba(102,73,48,0.15)"
          : (scrolled ? "0 8px 32px rgba(0,0,0,0.24)" : "none")
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo - Clipped circle to remove any black square box cleanly */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <div className="w-14 h-14 shrink-0 transition-all duration-300 group-hover:scale-105 flex items-center justify-center bg-transparent">
              <img
                src={logoImg}
                alt="VSB Logo"
                className="w-full h-full object-contain p-0 m-0 rounded-full"
                style={{ clipPath: "circle(47% at 50% 50%)" }}
              />
            </div>
            <span
              className="font-black text-xl sm:text-2xl tracking-tight font-syne transition-all duration-300"
              style={{ color: isAdminPage ? "#3D2918" : "#FFFFFF" }}
            >
              VSB{" "}
              <span
                className="transition-all duration-300"
                style={{
                  color: isAdminPage ? "#664930" : "#F59E0B",
                  textShadow: isAdminPage ? "0 1px 2px rgba(0,0,0,0.1)" : "0 0 16px rgba(245,158,11,0.65)"
                }}
              >
                Portal
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith("/#");
              const active = isActive(link.path);

              const linkClass = `relative px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 ${
                isAdminPage
                  ? (active
                      ? "text-[#FFDBBB] bg-[#664930] shadow-md"
                      : "text-[#3D2918] hover:text-[#664930] hover:bg-[#664930]/15")
                  : (active
                      ? "text-white bg-white/[0.08]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]")
              }`;

              return isHash ? (
                <a key={link.path} href={link.path.substring(1)} className={linkClass}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.path} to={link.path} className={linkClass}>
                  {link.name}
                  {active && !isAdminPage && (
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
                  <StarButton to="/events" variant={isAdminPage ? "gold" : "violet"} className="flex items-center gap-1.5 font-black">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Register Now
                  </StarButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin Controls */}
            {adminUser && isAdminPage && (
              <div
                className="flex items-center gap-3 ml-3 pl-3"
                style={{ borderLeft: "2px solid #664930" }}
              >
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 shadow-md"
                  style={{
                    background: "#664930",
                    border: "1px solid #3D2918",
                    color: "#FFDBBB"
                  }}
                >
                  <User className="w-3.5 h-3.5 text-[#FFDBBB]" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {adminUser && isAdminPage && (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-xl transition-all shadow-sm"
                style={{
                  background: "#664930",
                  color: "#FFDBBB"
                }}
              >
                <User className="w-4 h-4 text-[#FFDBBB]" />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl transition-all duration-250"
              style={{ color: isAdminPage ? "#3D2918" : "rgba(255,255,255,0.6)" }}
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
            className="md:hidden border-b shadow-xl overflow-hidden"
            style={{
              background: isAdminPage ? "#FFDBBB" : "#090D16",
              borderColor: isAdminPage ? "#664930" : "rgba(255,255,255,0.1)"
            }}
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                    isAdminPage
                      ? (isActive(link.path) ? "bg-[#664930] text-[#FFDBBB]" : "text-[#3D2918] hover:bg-[#664930]/20")
                      : (isActive(link.path) ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5")
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {adminUser && isAdminPage && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
