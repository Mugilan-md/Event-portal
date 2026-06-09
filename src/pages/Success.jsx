import React, { useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { Check, Calendar, MapPin, Printer, ArrowRight, ShieldCheck } from "lucide-react";

export default function Success() {
  const location = useLocation();
  const registration = location.state?.registration;
  const event = location.state?.event;

  useEffect(() => {
    if (registration) {
      // Fire confetti celebration
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [registration]);

  // If no registration state is present, redirect back to events list
  if (!registration) {
    return <Navigate to="/events" replace />;
  }

  // QR Code Payload
  const qrPayload = JSON.stringify({
    registrationId: registration.registrationId,
    name: registration.name,
    eventTitle: registration.eventTitle,
    college: registration.collegeName,
    phone: registration.phone
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-[#030014] pt-28 pb-20 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black print:pt-0 print:pb-0">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none print:hidden" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none print:hidden" />

      <div className="max-w-xl mx-auto space-y-8 relative z-10 text-center">
        {/* Success Icon */}
        <div className="print:hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20"
          >
            <Check className="w-10 h-10 text-white stroke-[3px]" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-6">
            Registration <span className="text-gradient">Confirmed!</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Your seat is successfully reserved. Save this pass for entry.
          </p>
          {location.state?.emailSent !== false ? (
            <p className="text-emerald-500 font-semibold text-xs mt-3 print:hidden bg-emerald-500/10 py-1.5 px-3 rounded-full inline-block border border-emerald-500/20">
              ✓ Confirmation email has been sent to {registration.email}
            </p>
          ) : (
            <p className="text-amber-500 font-semibold text-xs mt-3 print:hidden bg-amber-500/10 py-1.5 px-3 rounded-full inline-block border border-amber-500/20">
              ⚠ Email delivery failed, but your seat is reserved.
            </p>
          )}
        </div>

        {/* The Pass / Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl glass-panel border border-purple-500/20 text-left overflow-hidden relative shadow-2xl print:border-none print:shadow-none print:bg-white"
        >
          {/* Hologram Gradient Top Banner */}
          <div className="h-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 print:hidden" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Logo and registration ID */}
            <div className="flex justify-between items-start border-b border-purple-500/10 pb-6 print:border-black/10">
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white print:text-black">
                  EVENT<span className="text-purple-400 print:text-indigo-600">PASS</span>
                </span>
                <p className="text-[10px] text-gray-500 mt-0.5 print:text-black/60">Official Attendee Credential</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-400 font-extrabold tracking-widest uppercase print:text-indigo-600">ID CODE</span>
                <p className="text-lg font-mono font-bold text-white tracking-wider print:text-black">
                  {registration.registrationId}
                </p>
              </div>
            </div>

            {/* Event Name */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Registered Event</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mt-1 print:text-black">
                {registration.eventTitle}
              </h2>
            </div>

            {/* Student details */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-purple-500/10 py-5 print:border-black/10">
              <div>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Attendee</span>
                <span className="text-sm font-bold text-gray-200 mt-0.5 block print:text-black">{registration.name}</span>
                <span className="text-xs text-gray-400 block print:text-black/60">{registration.collegeName}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Department & Year</span>
                <span className="text-sm font-semibold text-gray-200 mt-0.5 block print:text-black">{registration.department}</span>
                <span className="text-xs text-gray-400 block print:text-black/60">{registration.year}</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 text-purple-400 shrink-0 print:text-indigo-600" />
                <div>
                  <span className="text-gray-400 block print:text-black/60">Date & Time</span>
                  <span className="font-semibold text-gray-200 print:text-black">{event?.date || "TBD"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 print:text-indigo-600" />
                <div>
                  <span className="text-gray-400 block print:text-black/60">Venue</span>
                  <span className="font-semibold text-gray-200 print:text-black line-clamp-1">{event?.venue || "TBD"}</span>
                </div>
              </div>
            </div>

            {/* QR Code and verified stamp */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-6 border-t border-purple-500/10 print:border-black/10">
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs uppercase tracking-wider justify-center sm:justify-start">
                  <ShieldCheck className="w-4 h-4 stroke-[2.5px]" /> Secured Credential
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-[240px] print:text-black/60">
                  Scan QR code at the check-in venue desk to confirm attendance entry.
                </p>
              </div>

              {/* QR Code SVG */}
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-purple-500/15 shrink-0 print:border-black/10">
                <QRCodeSVG
                  value={qrPayload}
                  size={96}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="Q"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Ticket and Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm transition-all"
          >
            <Printer className="w-4 h-4" /> Print Ticket
          </button>
          
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-sm transition-all shadow-md group"
          >
            Explore More Events <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
