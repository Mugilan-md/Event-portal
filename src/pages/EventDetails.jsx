import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, ShieldAlert, BookOpen, Phone, User, Hourglass } from "lucide-react";
import { getEventById } from "../firebase/config";
import StarButton from "../components/ui/StarButton";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#FAFAFC" }}>
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 animate-spin" style={{ borderColor: "transparent", borderTopColor: "#6366F1", borderRightColor: "#6366F1" }} />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 animate-spin [animation-direction:reverse]" style={{ borderColor: "transparent", borderBottomColor: "#06B6D4", borderLeftColor: "#06B6D4" }} />
        </div>
        <p className="text-sm font-semibold tracking-widest uppercase animate-pulse" style={{ color: "#6366F1" }}>
          Retrieving Event Data...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "#FAFAFC" }}>
        <ShieldAlert className="w-16 h-16 mb-4 animate-bounce" style={{ color: "#EF4444" }} />
        <h1 className="text-3xl font-extrabold font-serif" style={{ color: "#0F172A" }}>Event Not Found</h1>
        <p className="mt-2 max-w-sm" style={{ color: "#64748B" }}>
          The event you are looking for might have been deleted, closed, or does not exist.
        </p>
        <Link
          to="/events"
          className="mt-6 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all"
          style={{ background: "#6366F1", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const isSoldOut = event.seatsAvailable === 0 && event.status === "open";
  const isClosed = event.status === "closed";
  const isCompleted = event.status === "completed";
  const canRegister = event.status === "open" && event.seatsAvailable > 0;

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8" style={{ background: "#FAFAFC" }}>
      {/* Background orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(99,102,241,0.05)" }} />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(6,182,212,0.04)" }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs" style={{ color: "#94A3B8" }}>
          <Link to="/" className="hover:text-[#6366F1] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-[#6366F1] transition-colors">Events</Link>
          <span>/</span>
          <span style={{ color: "#0F172A" }}>{event.title}</span>
        </div>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 10px 30px -5px rgba(9,13,22,0.08)" }}
        >
          {/* Image */}
          <div className="md:col-span-5 h-64 md:h-full relative min-h-[260px] overflow-hidden">
            <img
              src={event.posterUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60 hidden md:block" />
          </div>

          {/* Core Info */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(99,102,241,0.1)", color: "#6366F1", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {event.category || "General"}
                </span>
                {isSoldOut && <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>Sold Out</span>}
                {isClosed && <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>Closed</span>}
                {isCompleted && <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>Completed</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight" style={{ color: "#0F172A" }}>
                {event.title}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#64748B" }}>
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5" style={{ borderTop: "1px solid #F1F5F9" }}>
              <div>
                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "#94A3B8" }}>Date & Time</span>
                <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{event.date} at {event.time}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "#94A3B8" }}>Venue Location</span>
                <span className="text-sm font-semibold line-clamp-1" style={{ color: "#0F172A" }}>{event.venue}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detail grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left — Rules, Prizes, Coordinators */}
          <div className="lg:col-span-8 space-y-6">
            {event.rules && (
              <div className="p-6 sm:p-8 rounded-2xl space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(9,13,22,0.04)" }}>
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#0F172A" }}>
                  <BookOpen className="w-5 h-5" style={{ color: "#6366F1" }} /> Rules & Regulations
                </h3>
                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#64748B" }}>{event.rules}</div>
              </div>
            )}

            {event.prizes && (
              <div className="p-6 sm:p-8 rounded-2xl space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(9,13,22,0.04)" }}>
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#0F172A" }}>
                  <Award className="w-5 h-5" style={{ color: "#F59E0B" }} /> Prizes & Recognition
                </h3>
                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#64748B" }}>{event.prizes}</div>
              </div>
            )}

            {event.coordinators && event.coordinators.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(9,13,22,0.04)" }}>
                <h3 className="text-lg font-bold" style={{ color: "#0F172A" }}>Event Coordinators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.coordinators.map((coordinator, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl flex items-center justify-between transition-all duration-200"
                      style={{ background: "#FAFAFC", border: "1px solid #E2E8F0" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                          <User className="w-4 h-4" style={{ color: "#6366F1" }} />
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: "#0F172A" }}>{coordinator.name}</div>
                          <div className="text-[11px] uppercase tracking-widest mt-0.5" style={{ color: "#94A3B8" }}>Coordinator</div>
                        </div>
                      </div>
                      {coordinator.phone && (
                        <a
                          href={`tel:${coordinator.phone}`}
                          className="p-2 rounded-lg transition-all duration-200"
                          style={{ background: "rgba(6,182,212,0.06)", color: "#06B6D4" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(6,182,212,0.15)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(6,182,212,0.06)"; }}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Registration Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 sm:p-8 rounded-2xl space-y-5 sticky top-28" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(9,13,22,0.06)" }}>
              <h3 className="text-base font-bold pb-4" style={{ color: "#0F172A", borderBottom: "1px solid #F1F5F9" }}>Registration Details</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#64748B" }}>Registration Fee:</span>
                  <span className="font-extrabold text-base" style={{ color: "#0F172A" }}>
                    {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#64748B" }}>Team Setup:</span>
                  <span className="font-semibold" style={{ color: "#0F172A" }}>
                    {event.teamSize && event.teamSize > 1 ? `Up to ${event.teamSize} Members` : "Individual"}
                  </span>
                </div>
                {event.lastRegistrationDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span style={{ color: "#64748B" }}>Deadline:</span>
                    <span className="font-semibold flex items-center gap-1" style={{ color: "#EF4444" }}>
                      <Hourglass className="w-3.5 h-3.5" /> {event.lastRegistrationDate}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ color: "#64748B" }}>Slots Remaining:</span>
                  <span className={`font-bold ${event.seatsAvailable <= 5 ? "animate-pulse" : ""}`}
                    style={{ color: event.seatsAvailable <= 5 ? "#F59E0B" : "#10B981" }}>
                    {event.seatsAvailable} / {event.totalSeats || 100}
                  </span>
                </div>
              </div>

              {canRegister ? (
                <StarButton
                  to={`/register/${event.id}`}
                  variant="violet"
                  className="w-full text-center py-3.5 text-sm font-black tracking-wide flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-indigo-300" />
                  Register Now
                </StarButton>
              ) : (
                <button disabled className="w-full py-3.5 rounded-xl font-bold text-sm cursor-not-allowed" style={{ background: "#F8FAFC", color: "#94A3B8", border: "1px solid #E2E8F0" }}>
                  {isSoldOut ? "Registrations Sold Out" : isClosed ? "Registrations Closed" : "Event Completed"}
                </button>
              )}

              <div className="p-3.5 rounded-xl text-[11px] leading-relaxed" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", color: "#64748B" }}>
                ⚠️ For registration issues or payment verification delays, contact the coordinators listed. Ensure payment screenshots are clear before uploading.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
