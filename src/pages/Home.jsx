import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Award, Shield, ArrowRight, Hourglass, Plus, Minus, Send, CheckCircle, Zap, MessageSquare } from "lucide-react";
import { getEventsList, addContactQuery } from "../firebase/config";
import { useToast } from "../context/ToastContext";
import StarButton from "../components/ui/star-button";

export default function Home() {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timerFinished, setTimerFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sendingQuery, setSendingQuery] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    try {
      setSendingQuery(true);
      await addContactQuery({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        message: contactForm.message.trim()
      });
      showToast("Message sent successfully! The admin will contact you.", "success");
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      showToast("Failed to send message: " + err.message, "error");
    } finally {
      setSendingQuery(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const list = await getEventsList();
        setEvents(list);
        const openEvents = list
          .filter(e => e.status === "open")
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        if (openEvents.length > 0) setFeaturedEvent(openEvents[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!featuredEvent) return;
    const tDate = featuredEvent.timerDate || featuredEvent.date;
    const tTime = featuredEvent.timerTime || featuredEvent.time || "00:00:00";
    const targetDate = new Date(`${tDate} ${tTime}`);
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      if (difference <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimerFinished(true);
      } else {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [featuredEvent]);

  const faqs = [
    { question: "How do I register for an event?", answer: "Navigate to the Events page, select your desired event, and click 'Register'. Fill out the multi-step form to secure your spot and receive your QR pass." },
    { question: "Is there an entry fee?", answer: "Entry fees vary by event. Some are completely free, while others may have a nominal fee. Check the specific event details for pricing information." },
    { question: "Can I register as a team?", answer: "Yes! Many hackathons and competitions allow team registrations. During the registration process, you'll have the option to add team members." },
    { question: "What should I bring to the event?", answer: "Always bring your student ID and your digital QR pass (on your phone or printed). For hackathons, bring your laptop and charger." }
  ];

  const schedule = [
    { time: "09:00 AM", event: "Inauguration & Keynote", desc: "Kickoff the event with inspiring talks from industry leaders." },
    { time: "11:00 AM", event: "Hackathon Commences", desc: "Teams begin their 24-hour coding sprint." },
    { time: "02:00 PM", event: "Technical Symposium", desc: "Paper presentations and expert panel discussions." },
    { time: "05:00 PM", event: "Evening Workshops", desc: "Hands-on sessions on AI, Web3, and Cloud." }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pt-18" style={{ background: "#FAFAFC" }}>
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(99,102,241,0.06)" }} />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(6,182,212,0.05)" }} />

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 py-20 px-4 md:py-28 max-w-7xl mx-auto">
        <div className="flex flex-col items-start gap-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#6366F1"
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            Next-Gen Registration Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif leading-tight"
            style={{ color: "#0F172A" }}
          >
            Step into the Future of <br />
            <span className="text-gradient-purple">Collegiate Events</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ color: "#64748B" }}
          >
            Discover state-of-the-art hackathons, paper symposiums, and hands-on coding workshops.
            Register instantly, secure your spot, and generate custom credentials with dynamic QR codes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <StarButton to="/events" variant="violet" className="inline-flex items-center justify-center gap-2">
              Explore Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </StarButton>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold transition-all duration-250"
              style={{
                background: "#FFFFFF",
                color: "#0F172A",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(9,13,22,0.06)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                e.currentTarget.style.color = "#6366F1";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#0F172A";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(9,13,22,0.06)";
              }}
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN TIMER ── */}
      {featuredEvent && (
        <section className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl relative overflow-hidden text-center"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px -8px rgba(9,13,22,0.08), 0 0 0 1px rgba(99,102,241,0.05)"
            }}
          >
            {/* Cyan glow corner */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(6,182,212,0.08)" }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(99,102,241,0.06)" }} />

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 uppercase tracking-widest"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#06B6D4"
              }}
            >
              <Zap className="w-3 h-3" />
              Next Live Event Countdown
            </div>

            {timerFinished ? (
              <div className="py-10 flex flex-col items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Hourglass className="w-12 h-12 mx-auto mb-2" style={{ color: "#F59E0B" }} />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
                  Registrations Closed
                </h2>
                <p className="font-semibold" style={{ color: "#6366F1" }}>
                  Upcoming events will be posted soon. Stay tuned!
                </p>
                <StarButton to="/events" variant="violet" className="mt-4 inline-flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Browse Past Events
                </StarButton>
              </div>
            ) : (
              <>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-8 font-serif transition-colors"
                  style={{ color: "#0F172A" }}
                >
                  {featuredEvent.title}
                </h2>

                <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto mb-8">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Minutes" },
                    { value: countdown.seconds, label: "Seconds" }
                  ].map((time, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 sm:p-5 rounded-xl text-center transition-all duration-250"
                      style={{
                        background: "#FAFAFC",
                        border: "1px solid #E2E8F0",
                        boxShadow: "inset 0 1px 3px rgba(9,13,22,0.04)"
                      }}
                    >
                      <div
                        className="text-2xl sm:text-4xl font-extrabold font-mono"
                        style={{ color: "#6366F1" }}
                      >
                        {String(time.value).padStart(2, "0")}
                      </div>
                      <div
                        className="text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-semibold"
                        style={{ color: "#94A3B8" }}
                      >
                        {time.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <StarButton
                  to={`/event/${featuredEvent.id}`}
                  variant="violet"
                  className="inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  <span>Register Now before seats run out</span>
                </StarButton>
              </>
            )}
          </motion.div>
        </section>
      )}

      {/* ── FEATURED EVENTS GRID ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
              Upcoming Technology Gatherings
            </h2>
            <p className="mt-2" style={{ color: "#64748B" }}>
              Handpicked elite technical symposia and competitions
            </p>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold flex items-center gap-1 transition-all duration-200 group"
            style={{ color: "#6366F1" }}
          >
            See all events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl animate-pulse"
                style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-2xl flex flex-col h-full overflow-hidden group transition-all duration-300"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 6px -1px rgba(9,13,22,0.05), 0 2px 4px -1px rgba(9,13,22,0.03)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 20px 40px -8px rgba(9,13,22,0.12), 0 0 0 1px rgba(99,102,241,0.1)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(9,13,22,0.05), 0 2px 4px -1px rgba(9,13,22,0.03)";
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        background: "rgba(99,102,241,0.9)",
                        color: "white",
                        backdropFilter: "blur(8px)"
                      }}
                    >
                      {event.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow relative">
                  <div className="absolute top-0 right-6 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md" style={{ border: "1px solid #E2E8F0" }}>
                    <Calendar className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6366F1" }}>
                      {event.date} • {event.time}
                    </div>
                    <h3
                      className="text-xl font-bold line-clamp-1 font-serif transition-colors duration-200"
                      style={{ color: "#0F172A" }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: "#64748B" }}>
                      {event.description}
                    </p>
                  </div>
                  <div
                    className="pt-5 mt-5 flex items-center justify-between"
                    style={{ borderTop: "1px solid #F1F5F9" }}
                  >
                    <div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: "#94A3B8" }}>Entry Fee</div>
                      <div className="text-base font-extrabold" style={{ color: "#0F172A" }}>
                        {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                      </div>
                    </div>
                    <StarButton to={`/event/${event.id}`} variant="violet" className="px-4 py-2 text-xs">
                      Details
                    </StarButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── SCHEDULE TIMELINE ── */}
      <section
        id="schedule"
        className="relative z-10 py-16"
        style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
              Event Schedule Timeline
            </h2>
            <p className="mt-2" style={{ color: "#64748B" }}>Plan your day with our tentative itinerary</p>
          </div>

          <div
            className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5"
            style={{ "--tw-before-bg": "none" }}
          >
            <div className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5" style={{ background: "linear-gradient(to bottom, transparent, rgba(99,102,241,0.3), transparent)" }} />
            {schedule.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                {/* Timeline circle */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-250"
                  style={{
                    background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                    boxShadow: "0 0 0 4px rgba(99,102,241,0.12)"
                  }}
                >
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>
                {/* Card */}
                <div
                  className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl transition-all duration-250 group-hover:-translate-y-1"
                  style={{
                    background: "#FAFAFC",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 3px rgba(9,13,22,0.05)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.12)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(9,13,22,0.05)";
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-base" style={{ color: "#6366F1" }}>{item.event}</h3>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#64748B" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section id="faqs" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
            Rules & FAQs
          </h2>
          <p className="mt-2" style={{ color: "#64748B" }}>Everything you need to know before registering</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden transition-all duration-250"
              style={{
                background: "#FFFFFF",
                border: activeFaq === idx ? "1px solid rgba(99,102,241,0.2)" : "1px solid #E2E8F0",
                boxShadow: activeFaq === idx ? "0 4px 12px rgba(99,102,241,0.1)" : "0 1px 3px rgba(9,13,22,0.04)"
              }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="font-semibold" style={{ color: "#0F172A" }}>{faq.question}</span>
                {activeFaq === idx
                  ? <Minus className="w-5 h-5 flex-shrink-0" style={{ color: "#6366F1" }} />
                  : <Plus className="w-5 h-5 flex-shrink-0" style={{ color: "#94A3B8" }} />
                }
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div
                      className="px-6 pb-5 text-sm leading-relaxed pt-3"
                      style={{ color: "#64748B", borderTop: "1px solid #F1F5F9" }}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section
        id="contact"
        className="relative z-10 py-20 overflow-hidden"
        style={{ background: "#090D16", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(99,102,241,0.12)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(6,182,212,0.08)" }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-widest"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.25)",
                  color: "#06B6D4"
                }}
              >
                <MessageSquare className="w-3 h-3" />
                Get in Touch
              </div>
              <h2 className="text-3xl font-extrabold font-serif text-white mb-4">
                Have Questions?
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Have questions about an upcoming event? Need help with your registration? Drop us a message and our support team will get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                {[
                  "24/7 Support Response",
                  "Direct Organizer Contact",
                  "Registration Assistance"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#06B6D4" }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="p-8 rounded-2xl relative"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)"
              }}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-40 pointer-events-none" style={{ background: "#F59E0B" }} />
              <form className="space-y-4 relative z-10" onSubmit={handleContactSubmit}>
                {[
                  { label: "Full Name", type: "text", key: "name", placeholder: "John Doe" },
                  { label: "Email Address", type: "email", key: "email", placeholder: "john@university.edu" }
                ].map(({ label, type, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#64748B" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={contactForm[key]}
                      onChange={(e) => setContactForm({ ...contactForm, [key]: e.target.value })}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#64748B" }}>
                    Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="How can we help?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>
                <StarButton
                  type="submit"
                  disabled={sendingQuery}
                  variant="violet"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sendingQuery ? "Sending..." : "Send Message"}
                </StarButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: "#0F172A" }}>
              Why Register With <br />
              <span style={{ color: "#6366F1" }}>VSB Event Portal?</span>
            </h2>
            <p className="leading-relaxed" style={{ color: "#64748B" }}>
              We provide technical communities with a robust, decentralized, and visually rich management hub.
              Attendees receive immediate confirmation credentials, unique verification QR codes, and streamlined coordinator support.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <Users className="w-10 h-10 shrink-0" style={{ color: "#6366F1" }} />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: "#0F172A" }}>4,000+ Students</h4>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Registered across multiple hackathons.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="w-10 h-10 shrink-0" style={{ color: "#F59E0B" }} />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: "#0F172A" }}>₹10 Lakhs+ Prizes</h4>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Awarded to symposium winners.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Hackathons", value: "24+", color: "#6366F1", glow: "rgba(99,102,241,0.1)" },
              { title: "Colleges", value: "150+", color: "#F59E0B", glow: "rgba(245,158,11,0.1)" },
              { title: "Symposiums", value: "48+", color: "#06B6D4", glow: "rgba(6,182,212,0.1)" },
              { title: "Active Admins", value: "10+", color: "#6366F1", glow: "rgba(99,102,241,0.1)" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -4 }}
                className="p-6 rounded-xl flex flex-col justify-center text-center transition-all duration-250"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(9,13,22,0.05)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 12px 24px ${stat.glow}, 0 0 0 1px ${stat.glow}`;
                  e.currentTarget.style.borderColor = `${stat.color}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(9,13,22,0.05)";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }}
              >
                <div className="text-3xl font-extrabold font-mono" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold mt-2 uppercase tracking-widest" style={{ color: "#94A3B8" }}>
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
