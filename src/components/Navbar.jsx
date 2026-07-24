import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShieldAlert, LogOut, Award } from "lucide-react";
import logoImg from "../assets/logo.png";
import { onAuthStateChanged, signOut } from "../firebase/config";
import { useToast } from "../context/ToastContext";
import StarButton from "./ui/star-button";

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
    <nav className="fixed top-0 left-0 w-full z-40 bg-[#F9F5EF]/90 backdrop-blur-md border-b border-[#F59E0B]/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <img
              src={logoImg}
              alt="VSB Logo"
              className="w-[72px] h-[72px] object-contain shrink-0 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#4338CA] font-serif transition-all duration-300">
              VSB <span className="text-[#FFD700] drop-shadow-[0_0_14px_rgba(255,215,0,0.7)] group-hover:drop-shadow-[0_0_28px_rgba(255,215,0,1)] transition-all duration-300">Portal</span>
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
                  className={`px-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 hover:text-[#4338CA] ${
                    isActive(link.path) ? "text-[#4338CA]" : "text-[#666666]"
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 hover:text-[#4338CA] ${
                    isActive(link.path) ? "text-[#4338CA]" : "text-[#666666]"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F59E0B]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Login Link Removed per user request */}

            {/* Sticky/Scroll Register Button */}
            <AnimatePresence>
              {showRegisterBtn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StarButton
                    to="/events"
                    variant="sky"
                    className="flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Register Now
                  </StarButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin Controls - Only show on admin routes */}
            {adminUser && location.pathname.startsWith("/admin") && (
              <div className="flex items-center gap-4 border-l border-[#F59E0B]/20 pl-4">
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4338CA]/10 border border-[#4338CA]/20 text-[#4338CA] hover:bg-[#4338CA]/20 text-xs font-bold transition-all"
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
                  <StarButton
                    to="/events"
                    variant="sky"
                    className="px-3.5 py-2 text-[10px]"
                  >
                    Register
                  </StarButton>
                </motion.div>
              )}
            </AnimatePresence>

            {adminUser && location.pathname.startsWith("/admin") && (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-lg bg-[#4338CA]/10 border border-[#4338CA]/20 text-[#4338CA]"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#666666] hover:text-[#4338CA] hover:bg-[#4338CA]/5 transition-colors focus:outline-none"
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
            className="md:hidden border-t border-[#F59E0B]/15 bg-[#F9F5EF] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isHash = link.path.startsWith("/#");
                return isHash ? (
                  <a
                    key={link.path}
                    href={link.path.substring(1)}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#666666] hover:bg-[#4338CA]/5 hover:text-[#4338CA]"
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
                        ? "bg-[#4338CA]/10 border-l-4 border-[#4338CA] text-[#4338CA]"
                        : "text-[#666666] hover:bg-[#4338CA]/5 hover:text-[#4338CA]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Login Link Removed per user request */}

              {adminUser && location.pathname.startsWith("/admin") ? (
                <div className="pt-4 border-t border-[#F59E0B]/15 space-y-2">
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-[#4338CA] bg-[#4338CA]/5 border border-[#4338CA]/10"
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
