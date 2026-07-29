import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Trash2, Search, RefreshCw, ChevronLeft, Calendar, User, Send, CheckCircle2, X, Clock, CornerDownRight } from "lucide-react";
import { getContactQueries, deleteContactQuery, updateContactQuery } from "../firebase/config";
import { sendQueryResponseEmail } from "../services/emailService";
import { useToast } from "../context/ToastContext";
import Icon3D from "../components/ui/Icon3D";

export default function ManageQueries() {
  const { showToast } = useToast();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getContactQueries();
      setQueries(list);
    } catch (err) {
      showToast("Failed to fetch queries: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await getContactQueries();
        if (isMounted) setQueries(list);
      } catch (err) {
        if (isMounted) showToast("Failed to fetch queries: " + err.message, "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

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

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedQuery) {
      showToast("Please enter a response message.", "error");
      return;
    }
    try {
      setSendingReply(true);
      // 1. Send Email to participant
      await sendQueryResponseEmail(selectedQuery, replyText.trim());

      // 2. Update Database Record
      await updateContactQuery(selectedQuery.id, {
        replyMessage: replyText.trim(),
        status: "Responded",
        repliedAt: new Date().toISOString()
      });

      showToast(`Response dispatched to ${selectedQuery.email} successfully!`, "success");
      setSelectedQuery(null);
      setReplyText("");
      fetchQueries();
    } catch (err) {
      showToast("Failed to send response: " + err.message, "error");
    } finally {
      setSendingReply(false);
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
              <p className="text-xs text-[#664930]/80 font-semibold">Read and send responses directly to participants' emails.</p>
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
                  className="p-6 rounded-3xl bg-[#523A25] backdrop-blur-xl border-2 border-[#FFDBBB]/50 hover:border-[#FFDBBB] transition-all flex flex-col justify-between shadow-2xl space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header: Participant Details & Badges */}
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
                          {query.college && (
                            <div className="text-[11px] font-bold text-[#CCBEB1] mt-0.5">
                              🏛️ {query.college}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {query.status === "Responded" ? (
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RESOLVED
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3 text-amber-400" /> PENDING
                          </span>
                        )}

                        {query.queryType && (
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FFDBBB] text-[#3D2918]">
                            {query.queryType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Original Message Area */}
                    <div className="p-4 rounded-2xl bg-[#3D2918] border border-[#FFDBBB]/30 text-[#FFF5EA] text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-wrap flex items-start gap-2.5 shadow-inner">
                      <MessageSquare className="w-4 h-4 text-[#FFDBBB] shrink-0 mt-0.5" />
                      <span className="text-[#FFF5EA]">{query.message}</span>
                    </div>

                    {/* Admin Response Logged Box */}
                    {query.replyMessage && (
                      <div className="p-3.5 rounded-2xl bg-[#2A1B10] border border-emerald-500/30 text-xs font-medium space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                          <CornerDownRight className="w-3.5 h-3.5" /> Admin Response Sent:
                        </div>
                        <p className="text-[#FFDBBB] italic pl-5 leading-relaxed">
                          "{query.replyMessage}"
                        </p>
                        {query.repliedAt && (
                          <div className="text-[10px] text-[#CCBEB1]/70 pl-5 font-mono">
                            Sent on: {new Date(query.repliedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between border-t border-[#FFDBBB]/20 pt-3 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#FFDBBB] font-mono font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#FFDBBB]" />
                      <span>{query.timestamp ? new Date(query.timestamp).toLocaleString() : "TBD"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(query.id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/35 border border-rose-400/40 transition-all"
                        title="Delete query"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedQuery(query);
                          setReplyText(query.replyMessage || "");
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFDBBB] hover:bg-[#FFFFFF] text-[#3D2918] transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5 text-[#3D2918]" />
                        {query.status === "Responded" ? "Edit Reply" : "Respond"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {selectedQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#523A25] border-2 border-[#FFDBBB] shadow-2xl relative text-left text-[#FFDBBB] space-y-5"
            >
              <button
                onClick={() => setSelectedQuery(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#3D2918] hover:bg-rose-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#FFDBBB]/70">
                  DISPATCH DIRECT RESPONSE
                </div>
                <h2 className="text-2xl font-black text-white font-syne mt-1">
                  Reply to {selectedQuery.name}
                </h2>
                <p className="text-xs text-[#FFDBBB] font-bold mt-0.5">
                  Recipient Email: <span className="text-cyan-300 font-mono">{selectedQuery.email}</span>
                </p>
              </div>

              {/* Original Query Preview */}
              <div className="p-3.5 rounded-2xl bg-[#3D2918] border border-[#FFDBBB]/30 text-xs text-[#FFF5EA]">
                <div className="font-bold text-[#FFDBBB] mb-1 text-[11px] uppercase tracking-wider">
                  Original Inquiry ({selectedQuery.queryType || "General"}):
                </div>
                <p className="italic">"{selectedQuery.message}"</p>
              </div>

              {/* Preset Reply Quick Buttons */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#FFDBBB]/80 mb-2">
                  Quick Template Presets:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: "Pass Verified",
                      text: `Dear ${selectedQuery.name},\n\nWe have reviewed your inquiry. Your QR Pass has been verified and your ticket status is active. Please check your email or student portal.\n\nBest regards,\nVSB Event Portal Conveners`
                    },
                    {
                      label: "Issue Resolved",
                      text: `Dear ${selectedQuery.name},\n\nThank you for reaching out. We have investigated your reported issue and resolved it in our portal system.\n\nBest regards,\nVSB Support Desk`
                    },
                    {
                      label: "Schedule Info",
                      text: `Dear ${selectedQuery.name},\n\nThank you for your inquiry regarding event timings. The updated event schedule and guidelines are now available on our portal.\n\nBest regards,\nVSB Event Desk`
                    }
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReplyText(tmpl.text)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#3D2918] hover:bg-[#FFDBBB] hover:text-[#3D2918] border border-[#FFDBBB]/40 text-[#FFDBBB] transition-all"
                    >
                      + {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Form */}
              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#FFDBBB] mb-2">
                    Your Response Message:
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Type your response to the participant..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-4 text-xs sm:text-sm rounded-xl !bg-[#2A1B10] border border-[#FFDBBB]/50 !text-[#FFDBBB] placeholder-[#CCBEB1]/60 focus:outline-none focus:border-[#FFDBBB] leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuery(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#3D2918] hover:bg-[#2A1B10] text-[#FFDBBB] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {sendingReply ? "Sending Email..." : "Send Response to Participant"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
