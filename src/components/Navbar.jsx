import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShieldAlert, LogOut, Award } from "lucide-react";
import logoImg from "../assets/logo.png";
import { onAuthStateChanged, signOut } from "../firebase/config";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showRegisterBtn, setShowRegisterBtn] = useState(false);
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
      // Show register button when user scrolls down 300px
      if (window.scrollY > 300) {
        setShowRegisterBtn(true);
      } else {
        setShowRegisterBtn(false);
      }
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
    if (path.startsWith("/#")) {
      return location.hash === path.substring(1);
    }
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
    <nav className="fixed top-0 left-0 w-full z-40 bg-[#F9F5EF]/90 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden group-hover:scale-105 transition-transform shrink-0 border border-[#D4AF37]/20">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1F3C88] font-serif">
              VSB <span className="text-[#D4AF37]">Portal</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith("/#");
              return isHash ? (
                <a
                  key={link.path}
                  href={link.path.substring(1)}
                  className={`px-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 hover:text-[#1F3C88] ${
                    isActive(link.path) ? "text-[#1F3C88]" : "text-[#666666]"
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 hover:text-[#1F3C88] ${
                    isActive(link.path) ? "text-[#1F3C88]" : "text-[#666666]"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#D4AF37]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Login Link */}
            {!adminUser && (
              <Link
                to="/admin-login"
                className={`px-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 hover:text-[#1F3C88] ${
                  isActive("/admin-login") ? "text-[#1F3C88]" : "text-[#666666]"
                }`}
              >
                Login
              </Link>
            )}

            {/* Sticky/Scroll Register Button */}
            <AnimatePresence>
              {showRegisterBtn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/events"
                    className="px-5 py-2.5 rounded-lg bg-[#1F3C88] hover:bg-[#172d66] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md border border-[#D4AF37]/30 flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Register Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin Controls */}
            {adminUser && (
              <div className="flex items-center gap-4 border-l border-[#D4AF37]/20 pl-4">
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3C88]/10 border border-[#1F3C88]/20 text-[#1F3C88] hover:bg-[#1F3C88]/20 text-xs font-bold transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D32F2F] hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden flex items-center gap-2">
            <AnimatePresence>
              {showRegisterBtn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mr-1"
                >
                  <Link
                    to="/events"
                    className="px-3.5 py-2 rounded-lg bg-[#1F3C88] text-white text-[10px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30"
                  >
                    Register
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {adminUser && (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-lg bg-[#1F3C88]/10 border border-[#1F3C88]/20 text-[#1F3C88]"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#666666] hover:text-[#1F3C88] hover:bg-[#1F3C88]/5 transition-colors focus:outline-none"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-[#D4AF37]/15 bg-[#F9F5EF] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isHash = link.path.startsWith("/#");
                return isHash ? (
                  <a
                    key={link.path}
                    href={link.path.substring(1)}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#666666] hover:bg-[#1F3C88]/5 hover:text-[#1F3C88]"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                      isActive(link.path)
                        ? "bg-[#1F3C88]/10 border-l-4 border-[#1F3C88] text-[#1F3C88]"
                        : "text-[#666666] hover:bg-[#1F3C88]/5 hover:text-[#1F3C88]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {!adminUser && (
                <Link
                  to="/admin-login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#666666] hover:bg-[#1F3C88]/5 hover:text-[#1F3C88]"
                >
                  Login
                </Link>
              )}

              {adminUser ? (
                <div className="pt-4 border-t border-[#D4AF37]/15 space-y-2">
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#1F3C88] bg-[#1F3C88]/5 border border-[#1F3C88]/10"
                  >
                    <User className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#D32F2F] hover:bg-[#D32F2F]/5"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
