import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="inline-flex p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400"
        >
          <ShieldAlert className="w-12 h-12 text-gradient-purple" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-wider font-mono text-gradient">404</h1>
          <h2 className="text-2xl font-bold text-white">Grid Coordinates Lost</h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            The link you are trying to intercept does not exist or has been shifted in cyber-space.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-xs transition-all shadow-md neon-glow-purple"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
