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
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-admin-body">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={MessageSquare} size="lg" color="gold" />
            <div className="space-y-1">
              <Link to="/admin-dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#FFDBBB] font-bold hover:underline transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFDBBB] font-syne tracking-tight drop-shadow-[0_2px_10px_rgba(255,219,187,0.3)]">Participant Queries</h1>
              <p className="text-xs text-[#CCBEB1] font-medium">Read and respond to inquiries submitted by attendees.</p>
            </div>
          </div>
          
          <button
            onClick={fetchQueries}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFDBBB] hover:bg-white text-[#664930] font-extrabold text-xs transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#664930]" /> Reload List
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
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1E1914]/90 border border-[#FFDBBB]/30 text-white placeholder-[#CCBEB1]/60 text-sm focus:outline-none focus:border-[#FFDBBB] transition-all"
          />
        </div>

        {/* Content list */}
        {loading && queries.length === 0 ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#FFDBBB] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQueries.length === 0 ? (
              <div className="col-span-full p-12 text-center text-[#CCBEB1] bg-[#1E1914]/90 border border-[#FFDBBB]/20 rounded-3xl">
                No queries found.
              </div>
            ) : (
              filteredQueries.map((query) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-[#1E1914]/95 backdrop-blur-xl border border-[#FFDBBB]/30 hover:border-[#FFDBBB]/60 transition-all flex flex-col justify-between shadow-2xl"
                >
                  <div className="space-y-4">
                    {/* Participant Details */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{query.name}</h3>
                          <a href={`mailto:${query.email}`} className="text-xs text-purple-400 hover:underline">{query.email}</a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(query.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all border border-rose-500/10"
                        title="Delete query"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Message Area */}
                    <div className="p-4 rounded-xl bg-[#FAFAFA]/60 border border-purple-500/5 text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>{query.message}</span>
                    </div>
                  </div>

                  {/* Timestamp Footer */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-4 border-t border-purple-500/5 pt-3">
                    <Calendar className="w-3.5 h-3.5" />
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
