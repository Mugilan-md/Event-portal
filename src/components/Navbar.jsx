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
        background: "#FFFFFF",
        borderBottom: "2px solid #997E67",
        boxShadow: "0 4px 20px rgba(102,73,48,0.12)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo - Full emblem, zero cropping, zero black box */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <div className="w-14 h-14 shrink-0 transition-all duration-300 group-hover:scale-105 flex items-center justify-center bg-transparent">
              <img
                src={logoImg}
                alt="VSB Logo"
                className="w-full h-full object-contain p-0 m-0"
              />
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tight font-syne text-[#1A0F07]">
              VSB{" "}
              <span className="text-[#664930] drop-shadow-sm">
                Portal
              </span>
            </span>
          </Link>

          {/* Desktop Navigation - Pure Creamy White Navbar with Pure Black/Mocha text */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith("/#");
              const active = isActive(link.path);

              const linkClass = `relative px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 ${
                active
                  ? "text-[#FFDBBB] bg-[#664930] shadow-md"
                  : "text-[#1A0F07] hover:text-[#664930] hover:bg-[#FFDBBB]/40"
              }`;

              return isHash ? (
                <a key={link.path} href={link.path.substring(1)} className={linkClass}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.path} to={link.path} className={linkClass}>
                  {link.name}
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
                  <StarButton to="/events" variant="gold" className="flex items-center gap-1.5 font-black">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Register Now
                  </StarButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin Controls */}
            {adminUser && (
              <div
                className="flex items-center gap-3 ml-3 pl-3"
                style={{ borderLeft: "2px solid #997E67" }}
              >
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 shadow-md bg-[#664930] text-[#FFDBBB] border border-[#3D2918] hover:bg-[#3D2918]"
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
            {adminUser && (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-xl transition-all shadow-md bg-[#664930] text-[#FFDBBB]"
              >
                <User className="w-4 h-4 text-[#FFDBBB]" />
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl transition-all duration-250 text-[#1A0F07] hover:bg-[#FFDBBB]/40"
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
            className="md:hidden border-b border-[#997E67] bg-[#FFFFFF] shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                    isActive(link.path)
                      ? "bg-[#664930] text-[#FFDBBB]"
                      : "text-[#1A0F07] hover:bg-[#FFDBBB]/30"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {adminUser && (
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
