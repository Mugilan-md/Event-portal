import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, SlidersHorizontal, BookOpen, ArrowRight } from "lucide-react";
import { getEventsList } from "../firebase/config";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const list = await getEventsList();
        setEvents(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ["All", "Hackathon", "Symposium", "Workshop", "Conference"];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.venue.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8" style={{ background: "#FAFAFC" }}>
      {/* Background orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(6,182,212,0.05)" }} />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(99,102,241,0.05)" }} />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* Page Header */}
        <div className="text-center space-y-4">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-2 uppercase tracking-widest"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366F1" }}
          >
            <Calendar className="w-3 h-3" /> All Events
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
            Explore <span className="text-gradient-purple">Upcoming Events</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base" style={{ color: "#64748B" }}>
            Discover technical opportunities, collaborate with brilliant minds, and elevate your skills.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(9,13,22,0.05)" }}
        >
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search by title, description or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm"
              style={{ borderRadius: "10px" }}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto">
            <span className="text-xs font-semibold uppercase tracking-wider mr-1 hidden lg:inline-flex items-center gap-1" style={{ color: "#94A3B8" }}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                style={
                  selectedCategory === cat
                    ? { background: "#6366F1", color: "white", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }
                    : { background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Listings */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl animate-pulse" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl space-y-4"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <BookOpen className="w-12 h-12 mx-auto" style={{ color: "#CBD5E1" }} />
            <h3 className="text-xl font-bold" style={{ color: "#0F172A" }}>No events match your criteria</h3>
            <p className="text-sm" style={{ color: "#64748B" }}>Try tweaking your search term or select another category.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => {
                const isSoldOut = event.seatsAvailable === 0 && event.status === "open";
                const isClosed = event.status === "closed";
                const isCompleted = event.status === "completed";

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl flex flex-col h-full overflow-hidden group transition-all duration-300"
                    style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 2px 4px rgba(9,13,22,0.04)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px -8px rgba(9,13,22,0.12), 0 0 0 1px rgba(99,102,241,0.1)";
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(9,13,22,0.04)";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    {/* Poster */}
                    <div className="h-48 relative overflow-hidden shrink-0">
                      <img
                        src={event.posterUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase" style={{ background: "rgba(99,102,241,0.9)", color: "white", backdropFilter: "blur(8px)" }}>
                          {event.category || "General"}
                        </span>
                        {isSoldOut && <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase" style={{ background: "rgba(245,158,11,0.9)", color: "white" }}>Sold Out</span>}
                        {isClosed && <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase" style={{ background: "rgba(239,68,68,0.9)", color: "white" }}>Closed</span>}
                        {isCompleted && <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase" style={{ background: "rgba(16,185,129,0.9)", color: "white" }}>Completed</span>}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6366F1" }}>
                            <Calendar className="w-3.5 h-3.5" />
                            {event.date} • {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
                            <MapPin className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold line-clamp-1 font-serif" style={{ color: "#0F172A" }}>{event.title}</h3>
                        <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: "#64748B" }}>{event.description}</p>
                      </div>

                      <div className="pt-5 mt-5 flex items-center justify-between" style={{ borderTop: "1px solid #F1F5F9" }}>
                        <div className="space-y-0.5">
                          <div className="text-[10px] uppercase tracking-widest" style={{ color: "#94A3B8" }}>Entry Fee</div>
                          <div className="text-base font-extrabold" style={{ color: "#0F172A" }}>
                            {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/event/${event.id}`}
                            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                            style={{ background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#6366F1"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
                          >
                            Details
                          </Link>
                          {event.status === "open" && event.seatsAvailable > 0 ? (
                            <Link
                              to={`/register/${event.id}`}
                              className="px-4 py-2 rounded-lg text-white font-semibold text-xs transition-all duration-250"
                              style={{ background: "#6366F1", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#4F46E5"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "#6366F1"; e.currentTarget.style.transform = ""; }}
                            >
                              Register
                            </Link>
                          ) : (
                            <button disabled className="px-4 py-2 rounded-lg text-xs font-semibold cursor-not-allowed" style={{ background: "#F1F5F9", color: "#94A3B8", border: "1px solid #E2E8F0" }}>
                              Closed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
