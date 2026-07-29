import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Trash2, Search, RefreshCw, ChevronLeft, Calendar, User } from "lucide-react";
import { getContactQueries, deleteContactQuery } from "../firebase/config";
import { useToast } from "../context/ToastContext";
import Card3D from "../components/ui/Card3D";
import Icon3D from "../components/ui/Icon3D";

export default function ManageQueries() {
  const { showToast } = useToast();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const list = await getContactQueries();
      setQueries(list);
    } catch (err) {
      showToast("Failed to fetch queries: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      try {
        setLoading(true);
        await deleteContactQuery(id);
        showToast("Query deleted successfully", "success");
        fetchQueries();
      } catch (err) {
        showToast("Failed to delete query: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredQueries = queries.filter(q => 
    (q.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.message || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-admin-body bg-[#FFDBBB] text-[#664930]">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={MessageSquare} size="lg" color="gold" />
            <div className="space-y-1">
              <Link to="/admin-dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#664930] font-extrabold hover:underline transition-colors">
                <ChevronLeft className="w-4 h-4 text-[#664930]" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#664930] font-syne tracking-tight">Participant Queries</h1>
              <p className="text-xs text-[#664930]/80 font-semibold">Read and respond to inquiries submitted by attendees.</p>
            </div>
          </div>
          
          <button
            onClick={fetchQueries}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#664930] hover:bg-[#14110E] text-[#FFDBBB] font-extrabold text-xs transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFDBBB]" /> Reload List
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#CCBEB1]" />
          <input
            type="text"
            placeholder="Search queries by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#664930] border border-[#997E67] text-[#FFDBBB] placeholder-[#CCBEB1]/70 text-sm focus:outline-none focus:border-[#FFDBBB] transition-all"
          />
        </div>

        {/* Content list */}
        {loading && queries.length === 0 ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#664930] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQueries.length === 0 ? (
              <div className="col-span-full p-12 text-center text-[#CCBEB1] bg-[#664930] border border-[#997E67] rounded-3xl">
                No queries found.
              </div>
            ) : (
              filteredQueries.map((query) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-[#523A25] backdrop-blur-xl border-2 border-[#FFDBBB]/50 hover:border-[#FFDBBB] transition-all flex flex-col justify-between shadow-2xl"
                >
                  <div className="space-y-4">
                    {/* Participant Details */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#3D2918] border border-[#FFDBBB]/30 flex items-center justify-center text-[#FFDBBB] shadow-md">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-[#FFFFFF] text-base tracking-wide">{query.name}</h3>
                          <a href={`mailto:${query.email}`} className="text-xs font-bold text-[#FFDBBB] hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {query.email}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(query.id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/35 border border-rose-400/40 transition-all"
                        title="Delete query"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Message Area */}
                    <div className="p-4 rounded-2xl bg-[#3D2918] border border-[#FFDBBB]/30 text-[#FFF5EA] text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-wrap flex items-start gap-2.5 shadow-inner">
                      <MessageSquare className="w-4 h-4 text-[#FFDBBB] shrink-0 mt-0.5" />
                      <span className="text-[#FFF5EA]">{query.message}</span>
                    </div>
                  </div>

                  {/* Timestamp Footer */}
                  <div className="flex items-center gap-1.5 text-xs text-[#FFDBBB] font-mono font-bold mt-4 border-t border-[#FFDBBB]/20 pt-3">
                    <Calendar className="w-3.5 h-3.5 text-[#FFDBBB]" />
                    <span>{query.timestamp ? new Date(query.timestamp).toLocaleString() : "TBD"}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
