import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, User, School, BookOpen, Mail, Phone, Upload, Award, AlertCircle } from "lucide-react";
import { getEventById, registerParticipant } from "../firebase/config";
import { useToast } from "../context/ToastContext";
import { sendConfirmationEmail } from "../services/emailService";

export default function Registration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    collegeName: "",
    department: "",
    year: "1st Year",
    email: "",
    phone: "",
    teamMembers: "",
    paymentScreenshot: ""
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        if (!data || data.status !== "open" || data.seatsAvailable <= 0) {
          showToast("Registration is closed for this event.", "error");
          navigate("/events");
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Convert uploaded image to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("File size too large. Limit is 2MB.", "error");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, paymentScreenshot: reader.result }));
      setUploading(false);
      showToast("Payment screenshot uploaded successfully", "success");
    };
    reader.onerror = () => {
      showToast("Failed to read file", "error");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.collegeName.trim()) errors.collegeName = "College name is required";
    if (!formData.department.trim()) errors.department = "Department is required";
    
    // Email Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    // Phone Check
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Enter a valid phone number";
    }

    // Payment proof check if fee > 0
    if (event && event.registrationFee > 0 && !formData.paymentScreenshot) {
      errors.paymentScreenshot = "Payment screenshot upload is required for paid events";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please check all required fields.", "error");
      return;
    }

    try {
      setLoading(true);
      // Generate a unique 6 digit alphanumeric registration ID
      const regId = "ERP-" + Math.floor(100000 + Math.random() * 900000);
      
      const payload = {
        registrationId: regId,
        eventId: event.id,
        eventTitle: event.title,
        name: formData.name,
        collegeName: formData.collegeName,
        department: formData.department,
        year: formData.year,
        email: formData.email,
        phone: formData.phone,
        teamMembers: formData.teamMembers,
        paymentScreenshot: formData.paymentScreenshot
      };

      await registerParticipant(payload);
      
      let emailSent = false;
      try {
        await sendConfirmationEmail(payload, event);
        emailSent = true;
        showToast("Registration successful. Confirmation email has been sent.", "success");
      } catch (emailErr) {
        console.error("EmailJS dispatch failed:", emailErr);
        const errMsg = emailErr.text || emailErr.message || "Connection refused";
        showToast(`Email error: ${errMsg}`, "error");
      }
      
      // Navigate to Success page and pass data including email status
      navigate("/success", { state: { registration: payload, event, emailSent } });
    } catch (err) {
      showToast("Registration failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-purple-300 text-sm font-semibold tracking-wider animate-pulse">
          PREPARING SECURE CHECKOUT...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030014] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Blurs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        {/* Back navigation */}
        <Link
          to={`/event/${event?.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Event Details
        </Link>

        {/* Form Container */}
        <div className="p-6 sm:p-10 rounded-2xl glass-panel border border-purple-500/10 space-y-8 shadow-2xl">
          {/* Header */}
          <div className="border-b border-purple-500/10 pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Event Registration</h2>
            <p className="text-sm text-purple-400 mt-2 font-semibold uppercase tracking-wider">
              Registering for: <span className="text-white normal-case">{event?.title}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Core Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-400" /> Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-950/10 border ${
                    formErrors.name ? "border-rose-500" : "border-purple-500/20"
                  } text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {formErrors.name && <p className="text-xs text-rose-400 mt-1">{formErrors.name}</p>}
              </div>

              {/* College Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest flex items-center gap-1">
                  <School className="w-3.5 h-3.5 text-purple-400" /> College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="Enter your college/university"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-950/10 border ${
                    formErrors.collegeName ? "border-rose-500" : "border-purple-500/20"
                  } text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {formErrors.collegeName && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.collegeName}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Department <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science, IT"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-950/10 border ${
                    formErrors.department ? "border-rose-500" : "border-purple-500/20"
                  } text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {formErrors.department && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.department}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest block">
                  Year of Study
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0624] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-purple-400" /> Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. student@college.edu"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-950/10 border ${
                    formErrors.email ? "border-rose-500" : "border-purple-500/20"
                  } text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {formErrors.email && <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-purple-400" /> Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone with code"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-950/10 border ${
                    formErrors.phone ? "border-rose-500" : "border-purple-500/20"
                  } text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {formErrors.phone && <p className="text-xs text-rose-400 mt-1">{formErrors.phone}</p>}
              </div>
            </div>

            {/* Team size additional details */}
            {event?.teamSize > 1 && (
              <div className="space-y-2 border-t border-purple-500/10 pt-4">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest block">
                  Team Members <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  rows={2}
                  placeholder={`Enter name, email, and phone of up to ${event.teamSize - 1} other team members (one per line)`}
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-[10px] text-gray-500">
                  This event allows team registrations of up to {event.teamSize} members. You are registered as the Team Leader.
                </p>
              </div>
            )}

            {/* Payment Portal QR scan & Screenshot upload if Paid */}
            {event?.registrationFee > 0 ? (
              <div className="space-y-6 border-t border-purple-500/10 pt-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-400" /> Payment & Validation
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    This is a paid event. Scan the portal UPI QR code below to transfer <strong>₹{event.registrationFee}</strong>, then upload the transaction receipt.
                  </p>
                </div>

                {/* QR Code Container and Instruction */}
                <div className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-xl bg-[#070420]/75 border border-purple-500/10">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg shrink-0">
                    {/* Mock UPI Code using a dynamic image generator */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=eventportal@upi%26pn=EventPortal%26am=${event.registrationFee}%26cu=INR`}
                      alt="Payment QR"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-xs space-y-1.5 text-gray-400">
                    <p className="font-semibold text-white">Payment UPI Details:</p>
                    <p>UPI ID: <strong className="text-purple-400">eventportal@upi</strong></p>
                    <p>Payee: <strong>Event Registration Portal</strong></p>
                    <p>Amount: <strong className="text-white">₹{event.registrationFee}</strong></p>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      * Save the transaction ID and take a screenshot of the successful transfer status screen.
                    </p>
                  </div>
                </div>

                {/* Receipt attachment area */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest block">
                    Upload Payment Receipt <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative border-2 border-dashed border-purple-500/20 rounded-xl p-6 text-center hover:border-purple-500/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400">
                        <Upload className="w-5 h-5 animate-bounce" />
                      </div>
                      <div className="text-xs text-gray-400">
                        {formData.paymentScreenshot ? (
                          <span className="text-emerald-400 font-semibold line-clamp-1">
                            ✓ Screenshot Loaded successfully! Click to change
                          </span>
                        ) : (
                          <span>Drag and drop image file, or click to browse (Max 2MB)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {formData.paymentScreenshot && (
                    <div className="mt-2 text-center">
                      <img
                        src={formData.paymentScreenshot}
                        alt="Uploaded proof"
                        className="mx-auto h-24 rounded border border-purple-500/20 object-contain"
                      />
                    </div>
                  )}
                  {formErrors.paymentScreenshot && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.paymentScreenshot}
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Submit checkout */}
            <div className="pt-6 border-t border-purple-500/10 mt-6">
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-extrabold text-sm transition-all shadow-lg neon-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING SECURE SUBMIT..." : "CONFIRM & REGISTER"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
