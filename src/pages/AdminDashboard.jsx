import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, IndianRupee, Heart, ShieldAlert, ArrowRight, UserPlus, Database, ArrowUpRight, BarChart3, Mail } from "lucide-react";
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#14110E] text-white font-admin-body">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#FFDBBB] animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#997E67] animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-[#FFDBBB] text-sm font-semibold tracking-wider animate-pulse font-mono">
          SYNCHRONIZING ANALYTICS...
        </p>
      </div>
    );
  }

  // Quick Stats config - uses IndianRupee icon!
  const stats = [
    { title: "Total Events", value: totalEvents, icon: Calendar, color: "gold" },
    { title: "Registrations", value: totalRegistrations, icon: Users, color: "cyan" },
    { title: "Revenue Collected", value: `₹${totalRevenue}`, icon: IndianRupee, color: "emerald" },
    { title: "Seats Remaining", value: `${seatsRemaining} left`, icon: Database, color: "gold" }
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-admin-body bg-[#FFDBBB] text-[#3D2918]">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={BarChart3} size="lg" color="gold" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#3D2918] flex items-center gap-2 font-syne tracking-tight">
                Admin Console Dashboard
              </h1>
              <p className="text-sm text-[#523A25] mt-1 font-bold">
                Real-time database records, telemetry & portal analytics.
              </p>
            </div>
          </div>
          <div className="text-xs text-[#3D2918] bg-[#664930]/15 border border-[#664930]/30 px-4 py-2 rounded-full font-black flex items-center gap-2 shadow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" /> Connection Stable
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card3D key={idx} depth={20} maxTilt={10}>
              <motion.div
                whileHover={{ scale: 1.04, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-6 rounded-3xl backdrop-blur-xl bg-[#664930] border-2 border-[#FFDBBB]/40 shadow-2xl relative overflow-hidden flex justify-between items-start transition-all duration-300 hover:border-[#FFDBBB] hover:shadow-[0_20px_40px_rgba(102,73,48,0.45)] cursor-pointer group"
              >
                <div>
                  <span className="text-[11px] text-[#FFDBBB] uppercase tracking-widest block font-black group-hover:text-[#FFFFFF] transition-colors">{stat.title}</span>
                  <span className="text-3xl sm:text-4xl font-mono font-black text-[#FFFFFF] mt-2 block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform">
                    {stat.value}
                  </span>
                </div>
                <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Icon3D icon={stat.icon} size="md" color={stat.color} />
                </div>
              </motion.div>
            </Card3D>
          ))}
        </div>

        {/* Shortcuts / Fast Management Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Manage Events Link */}
          <Card3D depth={18} maxTilt={8}>
            <motion.div whileHover={{ scale: 1.03, y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
              <Link
                to="/admin/manage-events"
                className="p-6 rounded-3xl backdrop-blur-xl bg-[#664930] border-2 border-[#FFDBBB]/30 shadow-2xl hover:border-[#FFFFFF] hover:shadow-[0_25px_50px_rgba(61,41,24,0.5)] transition-all group flex items-center justify-between h-full"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#FFDBBB] group-hover:text-[#FFFFFF] transition-colors flex items-center gap-2 font-syne">
                    Manage Events <ArrowUpRight className="w-5 h-5 text-[#FFDBBB] group-hover:text-[#FFFFFF] group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-300" />
                  </h3>
                  <p className="text-xs text-[#FFF5EA] max-w-sm leading-relaxed font-bold">
                    Add new hackathons, edit coordinator contact details, set deadlines, and manage registration status fields.
                  </p>
                </div>
                <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon3D icon={Calendar} size="lg" color="violet" />
                </div>
              </Link>
            </motion.div>
          </Card3D>

          {/* Manage Registrations Link */}
          <Card3D depth={18} maxTilt={8}>
            <motion.div whileHover={{ scale: 1.03, y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
              <Link
                to="/admin/manage-registrations"
                className="p-6 rounded-3xl backdrop-blur-xl bg-[#664930] border-2 border-[#FFDBBB]/30 shadow-2xl hover:border-[#FFFFFF] hover:shadow-[0_25px_50px_rgba(61,41,24,0.5)] transition-all group flex items-center justify-between h-full"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#FFDBBB] group-hover:text-[#FFFFFF] transition-colors flex items-center gap-2 font-syne">
                    Manage Registrations <ArrowUpRight className="w-5 h-5 text-[#FFDBBB] group-hover:text-[#FFFFFF] group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-300" />
                  </h3>
                  <p className="text-xs text-[#FFF5EA] max-w-sm leading-relaxed font-bold">
                    View student lists, download Excel/CSV files, and audit uploaded payment confirmation proofs.
                  </p>
                </div>
                <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon3D icon={Users} size="lg" color="cyan" />
                </div>
              </Link>
            </motion.div>
          </Card3D>

          {/* Manage Queries Link */}
          <Card3D depth={18} maxTilt={8}>
            <motion.div whileHover={{ scale: 1.03, y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
              <Link
                to="/admin/manage-queries"
                className="p-6 rounded-3xl backdrop-blur-xl bg-[#664930] border-2 border-[#FFDBBB]/30 shadow-2xl hover:border-[#FFFFFF] hover:shadow-[0_25px_50px_rgba(61,41,24,0.5)] transition-all group flex items-center justify-between h-full"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#FFDBBB] group-hover:text-[#FFFFFF] transition-colors flex items-center gap-2 font-syne">
                    Participant Queries <ArrowUpRight className="w-5 h-5 text-[#FFDBBB] group-hover:text-[#FFFFFF] group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-300" />
                  </h3>
                  <p className="text-xs text-[#FFF5EA] max-w-sm leading-relaxed font-bold">
                    Read and respond to messages submitted by participants from the "Get in Touch" contact form.
                  </p>
                </div>
                <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon3D icon={Mail} size="lg" color="gold" />
                </div>
              </Link>
            </motion.div>
          </Card3D>
        </div>

        {/* Recent Registrations Table preview */}
        <Card3D depth={15} maxTilt={5}>
          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-[#523A25] border-2 border-[#FFDBBB]/50 shadow-2xl space-y-6 hover:border-[#FFDBBB] transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] font-syne tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">Recent Registrations</h3>
                <p className="text-xs text-[#FFDBBB] mt-1 font-bold">Summary of latest submissions</p>
              </div>
              <Link
                to="/admin/manage-registrations"
                className="text-xs font-black text-[#FFDBBB] hover:text-[#FFFFFF] flex items-center gap-1 transition-all group"
              >
                See all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border-2 border-[#FFDBBB]/40 bg-[#1F130B] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#FFDBBB]/50 bg-[#140C07] uppercase tracking-wider font-mono font-black">
                    <th className="py-4 px-4" style={{ color: "#FFDBBB", fontSize: "12px" }}>ATTENDEE NAME</th>
                    <th className="py-4 px-4" style={{ color: "#FFDBBB", fontSize: "12px" }}>COLLEGE</th>
                    <th className="py-4 px-4" style={{ color: "#FFDBBB", fontSize: "12px" }}>REGISTERED EVENT</th>
                    <th className="py-4 px-4" style={{ color: "#FFDBBB", fontSize: "12px" }}>TICKET CODE</th>
                    <th className="py-4 px-4 text-right" style={{ color: "#FFDBBB", fontSize: "12px" }}>DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFDBBB]/20">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center font-bold" style={{ color: "#FFFFFF" }}>
                        No registrations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    registrations.slice(0, 5).map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#FFDBBB]/30 transition-all duration-200 cursor-pointer bg-[#2C1D10]">
                        <td className="py-4 px-4">
                          <span style={{ color: "#FFFFFF", fontWeight: "900", fontSize: "14px", letterSpacing: "0.02em" }}>
                            {reg.name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span style={{ color: "#FFDBBB", fontWeight: "700", fontSize: "13px" }}>
                            {reg.collegeName}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span style={{ color: "#2C1D10", backgroundColor: "#FFDBBB", fontWeight: "900", fontSize: "11px" }} className="inline-block px-3 py-1 rounded-full uppercase tracking-wider shadow-sm hover:scale-105 transition-transform">
                            {reg.eventTitle}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono">
                          <span style={{ color: "#38BDF8", backgroundColor: "#0F172A", fontWeight: "800", fontSize: "12px" }} className="inline-block px-2.5 py-1 rounded-lg border border-[#38BDF8]/40 shadow-sm hover:scale-105 transition-transform">
                            {reg.registrationId}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span style={{ color: "#FFFFFF", fontWeight: "800", fontSize: "13px" }}>
                            {reg.timestamp ? new Date(reg.timestamp).toLocaleDateString() : "TBD"}
                          </span>
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
