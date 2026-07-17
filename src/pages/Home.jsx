import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Award, Shield, ArrowRight, Hourglass, Plus, Minus, Send, CheckCircle } from "lucide-react";
import { getEventsList } from "../firebase/config";
import heroImg from "../assets/logo.png"; // Placeholder for hero 3D float image

export default function Home() {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

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
    <div className="relative min-h-screen bg-[#F9F5EF] overflow-hidden pt-18">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1F3C88]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section (Left-Right Layout) */}
      <section className="relative z-10 py-16 px-4 md:py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F3C88]/10 border border-[#1F3C88]/20 text-[#1F3C88] text-xs font-bold tracking-wider uppercase"
            >
              <Shield className="w-3.5 h-3.5" /> Next-Gen Registration Hub
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1A1A1A] font-serif leading-tight"
            >
              Step into the Future of <br />
              <span className="text-gradient-purple">Collegiate Events</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-[#666666] text-base sm:text-lg leading-relaxed max-w-xl"
            >
              Discover state-of-the-art hackathons, paper symposiums, and hands-on coding workshops. Register instantly, secure your spot, and generate custom credentials with dynamic QR codes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1F3C88] hover:bg-[#172d66] text-white font-bold transition-all duration-300 shadow-[0_4px_14px_rgba(31,60,136,0.3)] hover:shadow-[0_6px_20px_rgba(31,60,136,0.4)] border border-[#D4AF37]/30 group"
              >
                Explore Events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#1F3C88] border border-[#1F3C88]/20 font-bold transition-colors duration-300 shadow-sm"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Right 3D Float Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full md:w-1/2 relative flex justify-center perspective-1000"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-72 h-72 sm:w-96 sm:h-96"
            >
              {/* Decorative rings behind the float */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1F3C88]/20 to-[#D4AF37]/20 rounded-full blur-3xl transform -rotate-12" />
              
              <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 w-full h-12 bg-[#1F3C88] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="pt-16 p-6 h-full flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 mb-4 rounded-full bg-[#1F3C88]/10 flex items-center justify-center">
                      <Award className="w-12 h-12 text-[#D4AF37]" />
                   </div>
                   <h3 className="text-xl font-bold text-[#1F3C88] font-serif mb-2">QR Pass Generated</h3>
                   <p className="text-sm text-gray-500">Your secure access to the future of tech.</p>
                </div>
              </div>
            </motion.div>
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
            className="p-8 rounded-2xl bg-white border border-[#D4AF37]/20 text-center relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F3C88]/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1F3C88] mb-2">
              Next Live Event Countdown
            </h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mb-6 font-serif">
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
                <div key={idx} className="bg-[#F9F5EF] border border-[#1F3C88]/10 p-3 sm:p-5 rounded-xl shadow-inner">
                  <div className="text-2xl sm:text-4xl font-extrabold text-[#1F3C88] font-mono">
                    {String(time.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1">
                    {time.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={`/event/${featuredEvent.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1F3C88] text-white font-bold text-sm transition-all hover:bg-[#172d66] shadow-md border border-[#D4AF37]/30"
            >
              <Hourglass className="w-4 h-4 text-[#D4AF37] animate-spin" />
              Register Now before seats run out
            </Link>
          </motion.div>
        </section>
      )}

      {/* Category Hover Effects & Featured Events */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] font-serif">Upcoming Technology Gatherings</h2>
            <p className="text-gray-600 mt-2">Handpicked elite technical symposia and competitions</p>
          </div>
          <Link
            to="/events"
            className="text-sm font-bold text-[#1F3C88] hover:text-[#172d66] flex items-center gap-1 transition-colors"
          >
            See all events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-gray-200 animate-pulse border border-gray-300" />
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
                whileHover={{ y: -8 }}
                className="rounded-2xl bg-white flex flex-col h-full overflow-hidden border border-[#D4AF37]/20 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Poster */}
                <div className="h-48 relative overflow-hidden shrink-0">
                  <img
                    src={event.posterUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-md bg-[#1F3C88]/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-sm border border-[#D4AF37]/30">
                      {event.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-grow relative">
                   <div className="absolute top-0 right-6 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                   </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-xs text-[#1F3C88] font-bold uppercase tracking-wider">
                      {event.date} • {event.time}
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] line-clamp-1 font-serif group-hover:text-[#1F3C88] transition-colors">{event.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">Entry Fee</div>
                      <div className="text-base font-extrabold text-[#1A1A1A]">
                        {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                      </div>
                    </div>
                    <Link
                      to={`/event/${event.id}`}
                      className="px-4 py-2 rounded-lg bg-[#1F3C88] hover:bg-[#172d66] text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Schedule Accordion Timeline */}
      <section id="schedule" className="relative z-10 py-16 bg-white border-y border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] font-serif">Event Schedule Timeline</h2>
            <p className="text-gray-600 mt-2">Plan your day with our tentative itinerary</p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#D4AF37]/30 before:to-transparent">
            {schedule.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#1F3C88] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                   <span className="text-xs font-bold">{idx + 1}</span>
                </div>
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-[#F9F5EF] shadow-sm group-hover:border-[#D4AF37]/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#1F3C88] text-lg">{item.event}</h3>
                    <span className="text-xs font-bold text-[#D4AF37] px-2 py-1 bg-white rounded shadow-sm">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules & FAQ Accordion */}
      <section id="faqs" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] font-serif">Rules & FAQs</h2>
            <p className="text-gray-600 mt-2">Everything you need to know before registering</p>
          </div>

          <div className="space-y-4">
             {faqs.map((faq, idx) => (
               <div key={idx} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                 <button
                   onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                   className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                 >
                   <span className="font-bold text-[#1A1A1A]">{faq.question}</span>
                   {activeFaq === idx ? (
                     <Minus className="w-5 h-5 text-[#1F3C88]" />
                   ) : (
                     <Plus className="w-5 h-5 text-gray-400" />
                   )}
                 </button>
                 <AnimatePresence>
                   {activeFaq === idx && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.3 }}
                     >
                       <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                         {faq.answer}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
          </div>
      </section>

      {/* Contact Form Mockup */}
      <section id="contact" className="relative z-10 bg-[#1F3C88] text-white py-20 border-t border-[#D4AF37]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold font-serif text-white mb-4">Get in Touch</h2>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Have questions about an upcoming event? Need help with your registration? Drop us a message and our support team will get back to you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-sm">24/7 Support Response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-sm">Direct Organizer Contact</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-sm">Registration Assistance</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-2xl relative">
                 <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#D4AF37] rounded-full blur-2xl opacity-30" />
                 <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                      <input type="email" placeholder="john@university.edu" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Message</label>
                      <textarea rows="4" placeholder="How can we help?" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white text-gray-800"></textarea>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#c39b26] text-[#1F3C88] font-bold py-3 px-4 rounded-lg transition-colors shadow-md">
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] font-serif">
              Why Register With <br />
              <span className="text-[#1F3C88]">VSB Event Portal?</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We provide technical communities with a robust, decentralized, and visually rich management hub. Attendees receive immediate confirmation credentials, unique verification QR codes, and streamlined coordinator supports.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <Users className="w-10 h-10 text-[#1F3C88] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">4,000+ Students</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Registered across multiple hackathons.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="w-10 h-10 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">₹10 Lakhs+ Prizes</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Awarded to symposium winners.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Dashboard Graphic */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Hackathons", value: "24+", color: "text-[#1F3C88]" },
              { title: "Colleges", value: "150+", color: "text-[#D4AF37]" },
              { title: "Symposiums", value: "48+", color: "text-[#1F3C88]" },
              { title: "Active Admins", value: "10+", color: "text-[#D4AF37]" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl bg-white border border-[#D4AF37]/20 flex flex-col justify-center align-middle text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`text-3xl font-extrabold ${stat.color} font-mono`}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-widest">
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
