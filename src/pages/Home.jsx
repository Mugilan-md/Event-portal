import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, Award, Shield, ArrowRight, Hourglass } from "lucide-react";
import { getEventsList } from "../firebase/config";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const list = await getEventsList();
        setEvents(list);
        
        // Find the nearest upcoming open event
        const openEvents = list
          .filter(e => e.status === "open")
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (openEvents.length > 0) {
          setFeaturedEvent(openEvents[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!featuredEvent) return;

    const targetDate = new Date(`${featuredEvent.date}T${featuredEvent.time || "00:00:00"}`);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [featuredEvent]);

  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden pt-18">
      {/* Decorative Blur Background Lights */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 md:py-32 bg-grid-pattern">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase"
          >
            <Shield className="w-3.5 h-3.5" /> Next-Gen Registration Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight"
          >
            Unleash Innovation at <br />
            <span className="text-gradient">VSB Event Portal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed"
          >
            Discover state-of-the-art hackathons, paper symposiums, and hands-on coding workshops. Register instantly, secure your spot, and generate custom credentials.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold transition-all duration-300 neon-glow-purple group"
            >
              Explore Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold transition-colors duration-300"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      {featuredEvent && (
        <section className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass-panel border border-purple-500/20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
              Next Live Event Countdown
            </h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
              {featuredEvent.title}
            </h2>

            {/* Timer Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-xl mx-auto mb-8">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Minutes" },
                { value: countdown.seconds, label: "Seconds" }
              ].map((time, idx) => (
                <div key={idx} className="bg-purple-950/20 border border-purple-500/10 p-3 sm:p-5 rounded-xl">
                  <div className="text-2xl sm:text-4xl font-extrabold text-gradient-purple font-mono">
                    {String(time.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1">
                    {time.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={`/event/${featuredEvent.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 font-semibold text-sm transition-all"
            >
              <Hourglass className="w-4 h-4 text-purple-400 animate-spin" />
              Register Now before seats run out
            </Link>
          </motion.div>
        </section>
      )}

      {/* Featured Events */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Upcoming Technology Gatherings</h2>
            <p className="text-gray-400 mt-2">Handpicked elite technical symposia and competitions</p>
          </div>
          <Link
            to="/events"
            className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            See all events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl glass-panel glass-panel-hover flex flex-col h-full overflow-hidden border border-purple-500/15"
              >
                {/* Poster */}
                <div className="h-48 relative overflow-hidden shrink-0">
                  <img
                    src={event.posterUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/90 text-white text-[11px] font-bold tracking-wider uppercase shadow-md backdrop-blur-sm">
                      {event.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-3">
                    <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                      {event.date} • {event.time}
                    </div>
                    <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-purple-500/10 mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">Entry Fee</div>
                      <div className="text-base font-extrabold text-white">
                        {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                      </div>
                    </div>
                    <Link
                      to={`/event/${event.id}`}
                      className="px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-purple-500/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Register With <br />
              <span className="text-gradient">VSB Event Portal?</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We provide technical communities with a robust, decentralized, and visually rich management hub. Attendees receive immediate confirmation credentials, unique verification QR codes, and streamlined coordinator supports.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <Users className="w-10 h-10 text-purple-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">4,000+ Students</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Registered across multiple hackathons.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="w-10 h-10 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">₹10 Lakhs+ Prizes</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Awarded to symposium winners.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Dashboard Graphic */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Hackathons", value: "24+", color: "from-purple-500 to-purple-600" },
              { title: "Colleges", value: "150+", color: "from-blue-500 to-blue-600" },
              { title: "Symposiums", value: "48+", color: "from-violet-500 to-violet-600" },
              { title: "Active Admins", value: "10+", color: "from-indigo-500 to-indigo-600" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl glass-panel border border-purple-500/10 flex flex-col justify-center align-middle text-center"
              >
                <div className={`text-3xl font-extrabold bg-gradient-to-tr ${stat.color} bg-clip-text text-transparent font-mono`}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-widest">
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
