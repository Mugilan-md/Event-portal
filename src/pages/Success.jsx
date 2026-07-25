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
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, colors: ["#6366F1", "#06B6D4", "#F59E0B", "#818CF8"], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, colors: ["#6366F1", "#06B6D4", "#F59E0B", "#818CF8"], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [registration]);

  if (!registration) return <Navigate to="/events" replace />;

  const qrPayload = JSON.stringify({
    registrationId: registration.registrationId,
    name: registration.name,
    eventTitle: registration.eventTitle,
    college: registration.collegeName,
    phone: registration.phone
  });

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 print:bg-white print:pt-0" style={{ background: "#FAFAFC" }}>
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none print:hidden" style={{ background: "rgba(99,102,241,0.06)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none print:hidden" style={{ background: "rgba(6,182,212,0.05)" }} />

      <div className="max-w-xl mx-auto space-y-8 relative z-10 text-center">

        {/* Success Icon & heading */}
        <div className="print:hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}
          >
            <Check className="w-10 h-10 text-white stroke-[3px]" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-6 font-serif" style={{ color: "#0F172A" }}>
            Registration <span className="text-gradient-purple">Confirmed!</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#64748B" }}>
            Your seat is successfully reserved. Save this pass for entry.
          </p>

          {location.state?.emailSent !== false ? (
            <p className="text-xs mt-3 py-1.5 px-4 rounded-full inline-block font-semibold" style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>
              ✓ Confirmation email sent to {registration.email}
            </p>
          ) : (
            <p className="text-xs mt-3 py-1.5 px-4 rounded-full inline-block font-semibold" style={{ background: "rgba(245,158,11,0.08)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>
              ⚠ Email delivery failed, but your seat is reserved.
            </p>
          )}
        </div>

        {/* Ticket Pass */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl text-left overflow-hidden relative shadow-2xl print:shadow-none print:border-none print:bg-white"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          {/* Top gradient banner */}
          <div className="h-1.5 print:hidden" style={{ background: "linear-gradient(90deg, #6366F1, #06B6D4, #F59E0B)" }} />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header row */}
            <div className="flex justify-between items-start pb-5" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <div>
                <span className="font-extrabold text-lg tracking-tight print:text-black" style={{ color: "#0F172A" }}>
                  EVENT<span style={{ color: "#6366F1" }}>PASS</span>
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>Official Attendee Credential</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#06B6D4" }}>ID CODE</span>
                <p className="text-lg font-mono font-bold tracking-wider print:text-black" style={{ color: "#0F172A" }}>
                  {registration.registrationId}
                </p>
              </div>
            </div>

            {/* Event Name */}
            <div>
              <span className="text-[9px] uppercase tracking-widest block" style={{ color: "#94A3B8" }}>Registered Event</span>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight mt-1 font-serif print:text-black" style={{ color: "#0F172A" }}>
                {registration.eventTitle}
              </h2>
            </div>

            {/* Attendee details */}
            <div className="grid grid-cols-2 gap-4 py-5" style={{ borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
              <div>
                <span className="text-[9px] uppercase tracking-widest block" style={{ color: "#94A3B8" }}>Attendee</span>
                <span className="text-sm font-bold mt-0.5 block print:text-black" style={{ color: "#0F172A" }}>{registration.name}</span>
                <span className="text-xs block print:text-black/60" style={{ color: "#64748B" }}>{registration.collegeName}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest block" style={{ color: "#94A3B8" }}>Department & Year</span>
                <span className="text-sm font-semibold mt-0.5 block print:text-black" style={{ color: "#0F172A" }}>{registration.department}</span>
                <span className="text-xs block print:text-black/60" style={{ color: "#64748B" }}>{registration.year}</span>
              </div>
            </div>

            {/* Event specs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 shrink-0" style={{ color: "#6366F1" }} />
                <div>
                  <span className="block" style={{ color: "#94A3B8" }}>Date & Time</span>
                  <span className="font-semibold print:text-black" style={{ color: "#0F172A" }}>{event?.date || "TBD"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#06B6D4" }} />
                <div>
                  <span className="block" style={{ color: "#94A3B8" }}>Venue</span>
                  <span className="font-semibold line-clamp-1 print:text-black" style={{ color: "#0F172A" }}>{event?.venue || "TBD"}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-5" style={{ borderTop: "1px solid #F1F5F9" }}>
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider justify-center sm:justify-start" style={{ color: "#10B981" }}>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5px]" /> Secured Credential
                </div>
                <p className="text-[10px] leading-relaxed max-w-[240px] print:text-black/60" style={{ color: "#64748B" }}>
                  Scan QR code at the check-in venue desk to confirm attendance entry.
                </p>
              </div>
              <div className="p-3 rounded-2xl shadow-md shrink-0" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <QRCodeSVG value={qrPayload} size={96} bgColor="#FFFFFF" fgColor="#0F172A" level="Q" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-250"
            style={{ background: "#FFFFFF", color: "#0F172A", border: "1px solid #E2E8F0" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#6366F1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#0F172A"; }}
          >
            <Printer className="w-4 h-4" /> Print Ticket
          </button>
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-250 group"
            style={{ background: "#6366F1", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#4F46E5"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#6366F1"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.3)"; }}
          >
            Explore More Events <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
