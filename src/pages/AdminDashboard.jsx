import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, DollarSign, Heart, ShieldAlert, ArrowRight, UserPlus, Database, ArrowUpRight, BarChart3, Mail } from "lucide-react";
import { getEventsList, getRegistrationsList } from "../firebase/config";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evList, regList] = await Promise.all([
          getEventsList(),
          getRegistrationsList()
        ]);
        setEvents(evList);
        setRegistrations(regList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Metrics
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  
  const totalRevenue = registrations.reduce((sum, reg) => {
    // Find the associated event to check the fee
    const associatedEvent = events.find(e => e.id === reg.eventId);
    const fee = associatedEvent ? (associatedEvent.registrationFee || 0) : 0;
    return sum + fee;
  }, 0);

  const totalSeatsSold = registrations.length; // Each registration is a seat
  const totalSeatsCapacity = events.reduce((sum, e) => sum + (e.totalSeats || 0), 0);
  const seatsRemaining = Math.max(0, totalSeatsCapacity - totalSeatsSold);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-purple-300 text-sm font-semibold tracking-wider animate-pulse">
          SYNCHRONIZING ANALYTICS...
        </p>
      </div>
    );
  }

  // Quick Stats config
  const stats = [
    { title: "Total Events", value: totalEvents, icon: Calendar, color: "text-purple-400 border-purple-500/10" },
    { title: "Registrations", value: totalRegistrations, icon: Users, color: "text-blue-400 border-blue-500/10" },
    { title: "Revenue Collected", value: `₹${totalRevenue}`, icon: DollarSign, color: "text-emerald-400 border-emerald-500/10" },
    { title: "Seats Remaining", value: `${seatsRemaining} left`, icon: Database, color: "text-amber-400 border-amber-500/10" }
  ];

  return (
    <div className="relative min-h-screen bg-[#030014] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-purple-400" /> Admin Console Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Real-time database records and portal statistics.</p>
          </div>
          <div className="text-xs text-gray-500 bg-[#070420] border border-purple-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Connection Stable
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className={`p-6 rounded-2xl glass-panel border ${stat.color} shadow-lg relative overflow-hidden`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-semibold">{stat.title}</span>
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-2 block">
                    {stat.value}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shortcuts / Fast Management Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Manage Events Link */}
          <Link
            to="/admin/manage-events"
            className="p-6 rounded-2xl glass-panel border border-purple-500/15 hover:border-purple-500/35 hover:bg-purple-950/5 transition-all group flex items-center justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                Manage Events Page <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Add new hackathons, edit coordinator contact details, set deadlines, and manage registration status fields.
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
              <Calendar className="w-6 h-6" />
            </div>
          </Link>

          {/* Manage Registrations Link */}
          <Link
            to="/admin/manage-registrations"
            className="p-6 rounded-2xl glass-panel border border-purple-500/15 hover:border-purple-500/35 hover:bg-purple-950/5 transition-all group flex items-center justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                Manage Registrations Page <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-gray-400 max-w-sm">
                View student lists, download Excel/CSV files, and audit uploaded payment confirmation proofs.
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
              <Users className="w-6 h-6" />
            </div>
          </Link>

          {/* Manage Queries Link */}
          <Link
            to="/admin/manage-queries"
            className="p-6 rounded-2xl glass-panel border border-purple-500/15 hover:border-purple-500/35 hover:bg-purple-950/5 transition-all group flex items-center justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                Participant Queries <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Read and respond to messages submitted by participants from the "Get in Touch" contact form.
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
              <Mail className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Recent Registrations Table preview */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-500/10 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Summary of latest submissions</p>
            </div>
            <Link
              to="/admin/manage-registrations"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-500/10 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Attendee Name</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Registered Event</th>
                  <th className="py-3 px-4">Ticket Code</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5 text-gray-300">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-600">
                      No registrations recorded yet.
                    </td>
                  </tr>
                ) : (
                  registrations.slice(0, 5).map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{reg.name}</td>
                      <td className="py-3.5 px-4 text-gray-400">{reg.collegeName}</td>
                      <td className="py-3.5 px-4 text-purple-300 font-semibold">{reg.eventTitle}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-400">{reg.registrationId}</td>
                      <td className="py-3.5 px-4 text-right text-gray-500">
                        {reg.timestamp ? new Date(reg.timestamp).toLocaleDateString() : "TBD"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
