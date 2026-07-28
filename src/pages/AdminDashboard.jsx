import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, DollarSign, Heart, ShieldAlert, ArrowRight, UserPlus, Database, ArrowUpRight, BarChart3, Mail } from "lucide-react";
import { getEventsList, getRegistrationsList } from "../firebase/config";
import Card3D from "../components/ui/Card3D";
import Icon3D from "../components/ui/Icon3D";

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
    const associatedEvent = events.find(e => e.id === reg.eventId);
    const fee = associatedEvent ? (associatedEvent.registrationFee || 0) : 0;
    return sum + fee;
  }, 0);

  const totalSeatsSold = registrations.length;
  const totalSeatsCapacity = events.reduce((sum, e) => sum + (e.totalSeats || 0), 0);
  const seatsRemaining = Math.max(0, totalSeatsCapacity - totalSeatsSold);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-400 animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-indigo-300 text-sm font-semibold tracking-wider animate-pulse">
          SYNCHRONIZING ANALYTICS...
        </p>
      </div>
    );
  }

  // Quick Stats config
  const stats = [
    { title: "Total Events", value: totalEvents, icon: Calendar, color: "violet" },
    { title: "Registrations", value: totalRegistrations, icon: Users, color: "cyan" },
    { title: "Revenue Collected", value: `₹${totalRevenue}`, icon: DollarSign, color: "emerald" },
    { title: "Seats Remaining", value: `${seatsRemaining} left`, icon: Database, color: "gold" }
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-admin-body">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={BarChart3} size="lg" color="gold" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFDBBB] flex items-center gap-2 font-syne tracking-tight drop-shadow-[0_2px_10px_rgba(255,219,187,0.3)]">
                Admin Console Dashboard
              </h1>
              <p className="text-sm text-[#CCBEB1] mt-1 font-medium">Real-time database records, telemetry & portal analytics.</p>
            </div>
          </div>
          <div className="text-xs text-[#FFDBBB] bg-[#FFDBBB]/10 border border-[#FFDBBB]/30 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" /> Connection Stable
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card3D key={idx} depth={20} maxTilt={10}>
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-[#1E1914]/90 border border-[#FFDBBB]/25 shadow-2xl relative overflow-hidden flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-[#CCBEB1] uppercase tracking-widest block font-bold">{stat.title}</span>
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-2 block drop-shadow-[0_2px_8px_rgba(255,219,187,0.2)]">
                    {stat.value}
                  </span>
                </div>
                <Icon3D icon={stat.icon} size="md" color={stat.color} />
              </div>
            </Card3D>
          ))}
        </div>

        {/* Shortcuts / Fast Management Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Manage Events Link */}
          <Card3D depth={18} maxTilt={8}>
            <Link
              to="/admin/manage-events"
              className="p-6 rounded-3xl backdrop-blur-xl bg-[#1E1914]/90 border border-[#FFDBBB]/25 shadow-2xl hover:border-[#FFDBBB]/50 transition-all group flex items-center justify-between h-full"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFDBBB] transition-colors flex items-center gap-2 font-syne">
                  Manage Events <ArrowUpRight className="w-4 h-4 text-[#FFDBBB] opacity-80 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[#CCBEB1] max-w-sm leading-relaxed">
                  Add new hackathons, edit coordinator contact details, set deadlines, and manage registration status fields.
                </p>
              </div>
              <Icon3D icon={Calendar} size="lg" color="violet" />
            </Link>
          </Card3D>

          {/* Manage Registrations Link */}
          <Card3D depth={18} maxTilt={8}>
            <Link
              to="/admin/manage-registrations"
              className="p-6 rounded-3xl backdrop-blur-xl bg-[#1E1914]/90 border border-[#FFDBBB]/25 shadow-2xl hover:border-[#FFDBBB]/50 transition-all group flex items-center justify-between h-full"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFDBBB] transition-colors flex items-center gap-2 font-syne">
                  Manage Registrations <ArrowUpRight className="w-4 h-4 text-[#FFDBBB] opacity-80 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[#CCBEB1] max-w-sm leading-relaxed">
                  View student lists, download Excel/CSV files, and audit uploaded payment confirmation proofs.
                </p>
              </div>
              <Icon3D icon={Users} size="lg" color="cyan" />
            </Link>
          </Card3D>

          {/* Manage Queries Link */}
          <Card3D depth={18} maxTilt={8}>
            <Link
              to="/admin/manage-queries"
              className="p-6 rounded-3xl backdrop-blur-xl bg-[#1E1914]/90 border border-[#FFDBBB]/25 shadow-2xl hover:border-[#FFDBBB]/50 transition-all group flex items-center justify-between h-full"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFDBBB] transition-colors flex items-center gap-2 font-syne">
                  Participant Queries <ArrowUpRight className="w-4 h-4 text-[#FFDBBB] opacity-80 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[#CCBEB1] max-w-sm leading-relaxed">
                  Read and respond to messages submitted by participants from the "Get in Touch" contact form.
                </p>
              </div>
              <Icon3D icon={Mail} size="lg" color="gold" />
            </Link>
          </Card3D>
        </div>

        {/* Recent Registrations Table preview */}
        <Card3D depth={15} maxTilt={5}>
          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-[#1E1914]/95 border border-[#FFDBBB]/30 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white font-syne">Recent Registrations</h3>
                <p className="text-xs text-[#CCBEB1] mt-0.5">Summary of latest submissions</p>
              </div>
              <Link
                to="/admin/manage-registrations"
                className="text-xs font-bold text-[#FFDBBB] hover:underline flex items-center gap-1 transition-colors"
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#FFDBBB]/20 text-[#FFDBBB] uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Attendee Name</th>
                    <th className="py-3.5 px-4">College</th>
                    <th className="py-3.5 px-4">Registered Event</th>
                    <th className="py-3.5 px-4">Ticket Code</th>
                    <th className="py-3.5 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFDBBB]/10 text-slate-200">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#CCBEB1]">
                        No registrations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    registrations.slice(0, 5).map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#FFDBBB]/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{reg.name}</td>
                        <td className="py-3.5 px-4 text-[#CCBEB1]">{reg.collegeName}</td>
                        <td className="py-3.5 px-4 text-[#FFDBBB] font-semibold">{reg.eventTitle}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{reg.registrationId}</td>
                        <td className="py-3.5 px-4 text-right text-[#CCBEB1]">
                          {reg.timestamp ? new Date(reg.timestamp).toLocaleDateString() : "TBD"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
}

