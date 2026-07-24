import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, SlidersHorizontal, BookOpen } from "lucide-react";
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

  // Filter events based on search query and category
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
    <div className="relative min-h-screen bg-[#FAFAFA] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Explore <span className="text-gradient">Upcoming Events</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-sm sm:text-base">
            Discover technical opportunities, collaborate with brilliant minds, and elevate your skills in our events.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl glass-panel border border-purple-500/10">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mr-2 hidden lg:inline-flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/10"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                }`}
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
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 rounded-2xl glass-panel border border-purple-500/10 space-y-4">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-300">No events match your criteria</h3>
            <p className="text-gray-500 text-sm">Try tweaking your search term or select another category.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => {
                const isSoldOut = event.seatsAvailable === 0 && event.status === "open";
                const isClosed = event.status === "closed";
                const isCompleted = event.status === "completed";

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl glass-panel glass-panel-hover flex flex-col h-full overflow-hidden border border-purple-500/15"
                  >
                    {/* Event Poster Area */}
                    <div className="h-48 relative overflow-hidden shrink-0">
                      <img
                        src={event.posterUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/90 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-sm">
                          {event.category || "General"}
                        </span>
                        {isSoldOut && (
                          <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-sm">
                            Sold Out
                          </span>
                        )}
                        {isClosed && (
                          <span className="px-2.5 py-1 rounded-md bg-rose-500/90 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-sm">
                            Closed
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-sm">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5" />
                            {event.date} • {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Action footer */}
                      <div className="pt-6 border-t border-purple-500/10 mt-6 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Entry Fee</div>
                          <div className="text-base font-extrabold text-white">
                            {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/event/${event.id}`}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/5 transition-colors"
                          >
                            Details
                          </Link>
                          {event.status === "open" && event.seatsAvailable > 0 ? (
                            <Link
                              to={`/register/${event.id}`}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-xs shadow-md transition-colors"
                            >
                              Register
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2 rounded-lg bg-gray-500/10 text-gray-500 font-bold text-xs cursor-not-allowed border border-gray-500/10"
                            >
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
