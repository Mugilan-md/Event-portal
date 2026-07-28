import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Download, Eye, X, Filter, ChevronLeft, RefreshCw, AlertCircle, FileSpreadsheet, Edit2, Trash2, Save } from "lucide-react";
import { getEventsList, getRegistrationsList, deleteRegistration, updateRegistrationData } from "../firebase/config";
import { useToast } from "../context/ToastContext";
import Card3D from "../components/ui/Card3D";
import Icon3D from "../components/ui/Icon3D";

export default function ManageRegistrations() {
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState("All");
  const [activeProofUrl, setActiveProofUrl] = useState(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReg, setEditingReg] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    collegeName: "",
    department: "",
    year: "1st Year",
    email: "",
    phone: "",
    teamMembers: ""
  });

  const handleDelete = async (reg) => {
    if (window.confirm(`Are you absolutely sure you want to delete registration ID ${reg.registrationId} for ${reg.name}? This will free up 1 seat slot.`)) {
      try {
        setLoading(true);
        await deleteRegistration(reg.id, reg.eventId, reg.email, reg.registrationId);
        showToast("Registration deleted successfully", "success");
        fetchData();
      } catch (err) {
        showToast("Deletion failed: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (reg) => {
    setEditingReg(reg);
    setEditFormData({
      name: reg.name || "",
      collegeName: reg.collegeName || "",
      department: reg.department || "",
      year: reg.year || "1st Year",
      email: reg.email || "",
      phone: reg.phone || "",
      teamMembers: reg.teamMembers || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.collegeName.trim() || !editFormData.email.trim() || !editFormData.phone.trim()) {
      showToast("Please fill all required fields.", "error");
      return;
    }

    try {
      setLoading(true);
      await updateRegistrationData(editingReg.id, editFormData);
      showToast("Registration specifications updated successfully", "success");
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      showToast("Update failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [evList, regList] = await Promise.all([
        getEventsList(),
        getRegistrationsList()
      ]);
      setEvents(evList);
      setRegistrations(regList);
    } catch (err) {
      showToast("Failed to fetch data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter registrations based on selected event dropdown
  const filteredRegistrations = selectedEventId === "All"
    ? registrations
    : registrations.filter(r => r.eventId === selectedEventId);

  // CSV Exporter
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      showToast("No registration records found to export.", "error");
      return;
    }

    const headers = ["Registration ID", "Attendee Name", "College Name", "Department", "Year of Study", "Email Address", "Phone Number", "Registered Event", "Team Members", "Date Submitted"];
    
    const rows = filteredRegistrations.map(reg => [
      `"${reg.registrationId}"`,
      `"${reg.name}"`,
      `"${reg.collegeName}"`,
      `"${reg.department}"`,
      `"${reg.year}"`,
      `"${reg.email}"`,
      `"${reg.phone}"`,
      `"${reg.eventTitle}"`,
      `"${reg.teamMembers || "None"}"`,
      `"${reg.timestamp ? new Date(reg.timestamp).toLocaleDateString() : "TBD"}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const eventNameSegment = selectedEventId === "All" ? "All_Events" : selectedEventId;
    link.setAttribute("download", `Registrations_Export_${eventNameSegment}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV data sheet downloaded successfully", "success");
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-admin-body bg-[#FFDBBB] text-[#664930]">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={Users} size="lg" color="cyan" />
            <div className="space-y-1">
              <Link to="/admin-dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#664930] font-extrabold hover:underline transition-colors">
                <ChevronLeft className="w-4 h-4 text-[#664930]" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#664930] font-syne tracking-tight">Manage Registrations</h1>
              <p className="text-xs text-[#664930]/80 font-semibold">Live participant database directory and CSV sheet exporter.</p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#664930] hover:bg-[#14110E] text-[#FFDBBB] font-extrabold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4 text-[#FFDBBB]" /> Export CSV / Excel
          </button>
        </div>

        {/* Filter and stats wrapper */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-[#664930] border border-[#997E67] backdrop-blur-xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#FFDBBB]" />
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-[#14110E] border border-[#997E67] text-xs font-semibold text-[#FFDBBB] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#FFDBBB] cursor-pointer max-w-xs"
            >
              <option value="All">All Registered Events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-[#CCBEB1] font-bold uppercase tracking-wider">
            Displaying: <span className="text-[#FFDBBB] font-mono font-bold">{filteredRegistrations.length}</span> Records
          </div>
        </div>

        {/* Table data grid */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#664930] animate-spin" />
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#664930] backdrop-blur-xl border border-[#997E67] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-purple-500/10 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Attendee / College</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Registered Event</th>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/5 text-gray-300">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-600">
                        No registrations matching the filter query found.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{reg.name}</div>
                          <div className="text-gray-400 mt-0.5">{reg.collegeName} • <span className="text-[10px] uppercase text-gray-500">{reg.department} ({reg.year})</span></div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <div>{reg.email}</div>
                          <div className="text-gray-500 mt-0.5">{reg.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-purple-300">{reg.eventTitle}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-400">{reg.registrationId}</td>
                        <td className="py-3.5 px-4">
                          {reg.paymentScreenshot ? (
                            <button
                              onClick={() => setActiveProofUrl(reg.paymentScreenshot)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                          ) : (
                            <span className="text-gray-600 text-[10px] uppercase tracking-wider font-semibold">Free / Unpaid</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {reg.timestamp ? new Date(reg.timestamp).toLocaleDateString() : "TBD"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openEditModal(reg)}
                              className="p-1.5 rounded bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(reg)}
                              className="p-1.5 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Screenshot Modal Auditer */}
        <AnimatePresence>
          {activeProofUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-2xl bg-[#090625] border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-purple-500/10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-4.5 h-4.5 text-purple-400" /> Transaction Receipt Audit
                  </h3>
                  <button onClick={() => setActiveProofUrl(null)} className="text-gray-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 bg-[#FAFAFA] text-center">
                  <img
                    src={activeProofUrl}
                    alt="Receipt Screenshot"
                    className="max-h-[60vh] max-w-full mx-auto rounded-lg border border-purple-500/10 object-contain shadow-inner bg-black"
                  />
                </div>
                <div className="px-6 py-4 border-t border-purple-500/10 bg-[#FAFAFA] text-right">
                  <button
                    onClick={() => setActiveProofUrl(null)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                  >
                    Confirm & Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Registration Details Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-[#090625] border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-purple-500/10 bg-[#FAFAFA]/80">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-purple-400" /> Edit Registration Details
                  </h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto text-left flex-grow">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      placeholder="Student full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  {/* College Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">College Name</label>
                    <input
                      type="text"
                      name="collegeName"
                      value={editFormData.collegeName}
                      onChange={handleEditInputChange}
                      placeholder="College or university"
                      className="w-full px-4 py-2.5 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  {/* Department & Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={editFormData.department}
                        onChange={handleEditInputChange}
                        placeholder="e.g. Computer Science"
                        className="w-full px-4 py-2.5 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Year of Study</label>
                      <select
                        name="year"
                        value={editFormData.year}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAFAFA] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        placeholder="student@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-4 py-2.5 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Team Members (Optional)</label>
                    <textarea
                      name="teamMembers"
                      value={editFormData.teamMembers}
                      onChange={handleEditInputChange}
                      rows={2}
                      placeholder="Enter other team member details (if applicable)..."
                      className="w-full px-4 py-2.5 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Submit / Cancel buttons */}
                  <div className="flex gap-4 justify-end border-t border-purple-500/10 pt-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
