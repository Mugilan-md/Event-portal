import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, User, School, BookOpen, Mail, Phone, Upload, Award, AlertCircle, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(1);

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

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.name.trim()) errors.name = "Name is required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        errors.email = "Enter a valid email address";
      }

      const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Enter a valid phone number";
      }
    } else if (step === 2) {
      if (!formData.collegeName.trim()) errors.collegeName = "College name is required";
      if (!formData.department.trim()) errors.department = "Department is required";
    } else if (step === 3) {
      if (event && event.registrationFee > 0 && !formData.paymentScreenshot) {
        errors.paymentScreenshot = "Payment screenshot upload is required for paid events";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
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
      <div className="min-h-screen bg-[#F9F5EF] flex flex-col items-center justify-center gap-6">
        <div className="relative w-24 h-24">
           {/* Spinning QR pass animation placeholder */}
           <motion.div 
             animate={{ rotateY: 360 }}
             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
             className="w-full h-full bg-white border-2 border-[#4338CA] rounded-xl flex items-center justify-center shadow-lg"
           >
              <Award className="w-10 h-10 text-[#F59E0B]" />
           </motion.div>
        </div>
        <p className="text-[#4338CA] text-sm font-bold tracking-wider uppercase animate-pulse">
          PREPARING SECURE CHECKOUT...
        </p>
      </div>
    );
  }

  const totalSteps = 3;

  return (
    <div className="relative min-h-screen bg-[#F9F5EF] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#4338CA]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        {/* Back navigation */}
        <Link
          to={`/event/${event?.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#4338CA] transition-colors font-bold uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Event Details
        </Link>

        {/* Form Container */}
        <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#F59E0B]/20 space-y-8 shadow-xl">
          {/* Header & Progress Bar */}
          <div className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-serif">Event Registration</h2>
            <p className="text-sm text-[#666666] mt-2">
              Registering for: <span className="font-bold text-[#4338CA]">{event?.title}</span>
            </p>
            
            <div className="mt-6">
               <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  <span className={currentStep >= 1 ? "text-[#4338CA]" : ""}>Personal Info</span>
                  <span className={currentStep >= 2 ? "text-[#4338CA]" : ""}>Academic Info</span>
                  <span className={currentStep >= 3 ? "text-[#4338CA]" : ""}>Payment & Review</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                     className="h-full bg-gradient-to-r from-[#4338CA] to-[#F59E0B]"
                     initial={{ width: 0 }}
                     animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                     transition={{ duration: 0.3 }}
                  />
               </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: Personal Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#F59E0B]" /> Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                          formErrors.name ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                        } text-gray-800 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formErrors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#F59E0B]" /> Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. student@college.edu"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                          formErrors.email ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                        } text-gray-800 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formErrors.email && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#F59E0B]" /> Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone with code"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                          formErrors.phone ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                        } text-gray-800 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formErrors.phone && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.phone}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Academic Info */}
              {currentStep === 2 && (
                 <motion.div
                 key="step2"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.2 }}
                 className="space-y-6"
               >
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* College Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-[#F59E0B]" /> College Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        placeholder="Enter your college/university"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                          formErrors.collegeName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                        } text-gray-800 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formErrors.collegeName && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.collegeName}</p>}
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" /> Department <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science, IT"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                          formErrors.department ? "border-rose-500 focus:border-rose-500 focus:ring-rose-200" : "border-gray-200 focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                        } text-gray-800 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />
                      {formErrors.department && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{formErrors.department}</p>}
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest block">
                        Year of Study
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 transition-all"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Team size additional details */}
                  {event?.teamSize > 1 && (
                    <div className="space-y-2 border-t border-gray-100 pt-4 mt-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest block">
                        Team Members <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        name="teamMembers"
                        value={formData.teamMembers}
                        onChange={handleChange}
                        rows={3}
                        placeholder={`Enter name, email, and phone of up to ${event.teamSize - 1} other team members (one per line)`}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#4338CA] focus:ring-2 focus:ring-[#4338CA]/20 transition-all"
                      />
                      <p className="text-xs text-gray-500">
                        This event allows team registrations of up to {event.teamSize} members. You are registered as the Team Leader.
                      </p>
                    </div>
                  )}
                 </motion.div>
              )}

              {/* STEP 3: Payment & Review */}
              {currentStep === 3 && (
                 <motion.div
                 key="step3"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.2 }}
                 className="space-y-6"
               >
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-700 mb-6 space-y-2">
                   <p><strong className="text-[#111827]">Name:</strong> {formData.name}</p>
                   <p><strong className="text-[#111827]">Email:</strong> {formData.email}</p>
                   <p><strong className="text-[#111827]">College:</strong> {formData.collegeName} ({formData.department}, {formData.year})</p>
                 </div>

                 {/* Payment Portal QR scan & Screenshot upload if Paid */}
                 {event?.registrationFee > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-[#4338CA] uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#F59E0B]" /> Payment & Validation
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        This is a paid event. Scan the portal UPI QR code below to transfer <strong>₹{event.registrationFee}</strong>, then upload the transaction receipt.
                      </p>
                    </div>

                    {/* QR Code Container and Instruction */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-xl bg-white border border-[#F59E0B]/30 shadow-sm">
                      <div className="w-32 h-32 bg-gray-50 p-2 rounded-lg shrink-0 border border-gray-100">
                        {/* Mock UPI Code using a dynamic image generator */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=eventportal@upi%26pn=EventPortal%26am=${event.registrationFee}%26cu=INR`}
                          alt="Payment QR"
                          className="w-full h-full mix-blend-multiply"
                        />
                      </div>
                      <div className="text-xs space-y-1.5 text-gray-600">
                        <p className="font-bold text-[#4338CA]">Payment UPI Details:</p>
                        <p>UPI ID: <strong className="text-[#4338CA]">eventportal@upi</strong></p>
                        <p>Payee: <strong className="text-[#111827]">Event Registration Portal</strong></p>
                        <p>Amount: <strong className="text-[#111827]">₹{event.registrationFee}</strong></p>
                        <p className="text-[10px] text-gray-500 leading-tight italic mt-2">
                          * Save the transaction ID and take a screenshot of the successful transfer status screen.
                        </p>
                      </div>
                    </div>

                    {/* Receipt attachment area */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest block">
                        Upload Payment Receipt <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#4338CA]/50 hover:bg-blue-50/50 transition-all bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center mx-auto text-[#4338CA]">
                            <Upload className="w-5 h-5 animate-bounce" />
                          </div>
                          <div className="text-xs text-gray-600">
                            {formData.paymentScreenshot ? (
                              <span className="text-emerald-600 font-bold line-clamp-1 flex items-center justify-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Screenshot Loaded! Click to change
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
                            className="mx-auto h-24 rounded border border-gray-200 object-contain shadow-sm"
                          />
                        </div>
                      )}
                      {formErrors.paymentScreenshot && (
                        <p className="text-xs text-rose-500 mt-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {formErrors.paymentScreenshot}
                        </p>
                      )}
                    </div>
                  </div>
                 ) : (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                       <CheckCircle className="w-6 h-6 text-emerald-500" />
                       <div>
                          <p className="font-bold text-sm">Free Event</p>
                          <p className="text-xs">No payment required. You are ready to complete your registration.</p>
                       </div>
                    </div>
                 )}
                 </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-gray-100 mt-8 flex justify-between">
              {currentStep > 1 ? (
                 <button
                   type="button"
                   onClick={prevStep}
                   className="px-6 py-3 rounded-lg text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                 >
                   <ArrowLeft className="w-4 h-4" /> Back
                 </button>
              ) : <div></div>}
              
              {currentStep < 3 ? (
                 <button
                   type="button"
                   onClick={nextStep}
                   className="px-6 py-3 rounded-lg bg-[#4338CA] text-white font-bold text-sm hover:bg-[#312e81] transition-colors shadow-md flex items-center gap-2 border border-[#F59E0B]/30"
                 >
                   Continue <ArrowRight className="w-4 h-4" />
                 </button>
              ) : (
                 <button
                   type="submit"
                   disabled={loading || uploading}
                   className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#4338CA] to-[#312e81] text-white font-extrabold text-sm transition-all shadow-[0_4px_14px_rgba(31,60,136,0.3)] hover:shadow-[0_6px_20px_rgba(31,60,136,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-[#F59E0B]/50"
                 >
                   {loading ? (
                     <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 animate-spin text-[#F59E0B]" /> Processing...
                     </div>
                   ) : "CONFIRM & REGISTER"}
                 </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
