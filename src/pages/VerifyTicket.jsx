import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Calendar, MapPin, School, User, Users, ShieldAlert, Award } from "lucide-react";
import { getRegistrationByRegistrationId, getEventById } from "../firebase/config";
import vsbLogo from "../assets/vsb_logo.png";

export default function VerifyTicket() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        const reg = await getRegistrationByRegistrationId(id);
        if (reg) {
          setRegistration(reg);
          const ev = await getEventById(reg.eventId);
          if (ev) setEventDetail(ev);
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAFAFC" }}>
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-full border-4 border-t-[#6366F1] border-gray-200 rounded-full"
          />
        </div>
        <p className="text-[#64748B] text-sm font-semibold tracking-wide uppercase animate-pulse">
          Validating Attendee Pass...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center" style={{ background: "#FAFAFC" }}>
      {/* Decorative background orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(99,102,241,0.05)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(6,182,212,0.04)" }} />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Pass Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          {registration ? (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 8px 20px rgba(16,185,129,0.25)" }}
                >
                  <CheckCircle className="w-9 h-9 text-white stroke-[2.5px]" />
                </motion.div>
                <h2 className="text-2xl font-black font-serif text-[#10B981] tracking-wide mt-3">
                  TICKET VERIFIED
                </h2>
                <p className="text-xs text-[#64748B]">
                  Official Entry Pass ID: <span className="font-mono font-bold text-[#0F172A]">{registration.registrationId}</span>
                </p>
              </div>

              {/* College Organiser Row */}
              <div className="flex items-center gap-3.5 py-4 border-t border-b border-gray-100">
                <img
                  src={vsbLogo}
                  alt="V.S.B. Engineering College Logo"
                  className="w-11 h-11 object-contain shrink-0"
                />
                <div>
                  <span className="text-[8px] uppercase tracking-widest block font-bold text-[#64748B]">Organized By</span>
                  <span className="text-xs font-extrabold text-[#0F172A] block font-serif leading-tight">
                    V.S.B. Engineering College, Karur
                  </span>
                </div>
              </div>

              {/* Event Section */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest block font-bold text-[#64748B]">Registered Event</span>
                <h3 className="text-xl font-extrabold text-[#0F172A] font-serif leading-snug">
                  {registration.eventTitle}
                </h3>
                
                <div className="flex flex-col gap-1.5 text-xs text-[#64748B] pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>{eventDetail?.date || "TBD"} at {eventDetail?.time || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span className="line-clamp-1">{eventDetail?.venue || "TBD"}</span>
                  </div>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="p-4 rounded-2xl space-y-3 bg-[#FAFAFC] border border-gray-100 text-xs">
                <div>
                  <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider block">Attendee / Team Leader</span>
                  <p className="font-bold text-sm text-[#0F172A] mt-0.5">{registration.name}</p>
                  <p className="text-[#64748B] font-medium">{registration.collegeName}</p>
                  <p className="text-[#94A3B8]">{registration.department} • {registration.year}</p>
                </div>

                {registration.teamName && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider block">Team Name</span>
                    <p className="font-bold text-sm text-[#6366F1] mt-0.5" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem", lineHeight: "1" }}>
                      {registration.teamName}
                    </p>
                  </div>
                )}

                {registration.member1Name && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider block">Team Members</span>
                    <p className="font-semibold text-[#0F172A] mt-0.5 leading-relaxed">
                      {[registration.member1Name, registration.member2Name].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px]">
                  <div>
                    <span className="text-[#94A3B8] uppercase tracking-wider block">Total Members</span>
                    <span className="font-bold text-[#0F172A]">{registration.participantCount || 1} Participant(s)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#94A3B8] uppercase tracking-wider block">Payment Status</span>
                    <span className="font-bold text-[#10B981] uppercase">✓ Verified / Paid</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 8px 20px rgba(239,68,68,0.25)" }}
              >
                <XCircle className="w-9 h-9 text-white stroke-[2.5px]" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black font-serif text-[#EF4444] tracking-wide">
                  INVALID TICKET
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-xs mx-auto">
                  The credentials scanned do not match any active student registration record in the VSB Event Portal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 text-xs text-rose-600 flex items-center gap-2.5 justify-center">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Verification check failed. Please verify with the desk.</span>
              </div>
            </div>
          )}

          {/* Action to go back */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all font-serif"
              style={{ background: "#6366F1", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}
            >
              Back to Portal Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
