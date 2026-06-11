import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShieldAlert, LogOut } from "lucide-react";
import logoImg from "../assets/logo.png";
import { onAuthStateChanged, signOut } from "../firebase/config";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
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

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-[#030014]/65 backdrop-blur-md border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden group-hover:scale-105 transition-transform shrink-0 border border-purple-500/10">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
              VSB <span className="text-gradient">Event Portal</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                  isActive(link.path) ? "text-purple-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Admin Controls */}
            {adminUser ? (
              <div className="flex items-center gap-4 border-l border-purple-500/20 pl-6">
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-bold transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-purple-500/20 pl-6">
                <Link
                  to="/admin-login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all shadow-sm"
                  title="Admin Portal Access"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden flex items-center gap-3">
            {!adminUser && (
              <Link
                to="/admin-login"
                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400"
                title="Admin Portal Access"
              >
                <ShieldAlert className="w-4 h-4" />
              </Link>
            )}
            {adminUser && (
              <Link
                to="/admin-dashboard"
                className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300"
              >
                <User className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
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
            className="md:hidden border-t border-purple-500/10 bg-[#070420]/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-semibold ${
                    isActive(link.path)
                      ? "bg-purple-600/15 border-l-2 border-purple-500 text-purple-300"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {adminUser ? (
                <div className="pt-4 border-t border-purple-500/10 space-y-2">
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20"
                  >
                    <User className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg text-base font-semibold text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-purple-500/10 space-y-2">
                  <Link
                    to="/admin-login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-base font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
