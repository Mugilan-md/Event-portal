import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign, Users, Award, ShieldAlert, BookOpen, Phone, User, Hourglass } from "lucide-react";
import { getEventById } from "../firebase/config";

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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-purple-300 text-sm font-semibold tracking-wider animate-pulse">
          RETRIEVING EVENT DATA...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-center px-4">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-extrabold text-white">Event Not Found</h1>
        <p className="text-gray-400 mt-2 max-w-sm">
          The event you are looking for might have been deleted, closed, or does not exist.
        </p>
        <Link
          to="/events"
          className="mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
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
    <div className="relative min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500">
          <Link to="/" className="hover:text-purple-400">Home</Link> /{" "}
          <Link to="/events" className="hover:text-purple-400">Events</Link> /{" "}
          <span className="text-gray-300">{event.title}</span>
        </div>

        {/* Hero Section Banner */}
        <div className="rounded-2xl overflow-hidden glass-panel border border-purple-500/10 grid grid-cols-1 md:grid-cols-12">
          {/* Image */}
          <div className="md:col-span-5 h-64 md:h-full relative min-h-[300px]">
            <img
              src={event.posterUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FAFAFA]/80 hidden md:block" />
          </div>

          {/* Core Info */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  {event.category || "General"}
                </span>
                {isSoldOut && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    Sold Out
                  </span>
                )}
                {isClosed && (
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    Closed
                  </span>
                )}
                {isCompleted && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    Completed
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {event.title}
              </h1>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 border-t border-purple-500/10 pt-6">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Date & Time</span>
                <span className="text-sm font-semibold text-gray-200">{event.date} at {event.time}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Venue Location</span>
                <span className="text-sm font-semibold text-gray-200 line-clamp-1">{event.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-8">
            {/* Rules */}
            {event.rules && (
              <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/10 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" /> Rules & Regulations
                </h3>
                <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed space-y-2">
                  {event.rules}
                </div>
              </div>
            )}

            {/* Prize pool */}
            {event.prizes && (
              <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/10 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" /> Prizes & Recognition
                </h3>
                <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {event.prizes}
                </div>
              </div>
            )}

            {/* Coordinators */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/10 space-y-4">
                <h3 className="text-xl font-bold text-white">Event Coordinators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.coordinators.map((coordinator, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{coordinator.name}</div>
                          <div className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">Coordinator</div>
                        </div>
                      </div>
                      {coordinator.phone && (
                        <a
                          href={`tel:${coordinator.phone}`}
                          className="p-2 rounded-lg bg-purple-500/5 hover:bg-purple-500/25 text-purple-300 transition-colors"
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

          {/* Registration Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/10 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-purple-500/10 pb-4">Registration Details</h3>

              <div className="space-y-4">
                {/* Fee */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Registration Fee:</span>
                  <span className="font-extrabold text-white text-base">
                    {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                  </span>
                </div>

                {/* Team Size */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Team Setup:</span>
                  <span className="font-semibold text-gray-200">
                    {event.teamSize && event.teamSize > 1 ? `Up to ${event.teamSize} Members` : "Individual Participation"}
                  </span>
                </div>

                {/* Deadline */}
                {event.lastRegistrationDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Deadline:</span>
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <Hourglass className="w-3.5 h-3.5" />
                      {event.lastRegistrationDate}
                    </span>
                  </div>
                )}

                {/* Seats available */}
                <div className="flex justify-between items-center text-sm pt-4 border-t border-purple-500/10">
                  <span className="text-gray-400">Slots Remaining:</span>
                  <span className={`font-bold ${event.seatsAvailable <= 5 ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>
                    {event.seatsAvailable} / {event.totalSeats || 100}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2">
                {canRegister ? (
                  <Link
                    to={`/register/${event.id}`}
                    className="w-full text-center block py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-sm transition-all shadow-lg neon-glow-purple"
                  >
                    Register Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl bg-gray-500/10 text-gray-500 border border-gray-500/10 font-bold text-sm cursor-not-allowed text-center"
                  >
                    {isSoldOut ? "Registrations Sold Out" : isClosed ? "Registrations Closed" : "Event Completed"}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Warning */}
            <div className="p-4 rounded-xl bg-purple-950/5 border border-purple-500/5 text-[11px] text-gray-500 leading-relaxed">
              ⚠️ In case of any registration issues or payment verification delays, please directly contact the coordinators listed above. Ensure payment screenshots are clear before uploading during checkout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
