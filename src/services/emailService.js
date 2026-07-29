import emailjs from "@emailjs/browser";

/**
 * Sends a confirmation email using EmailJS Browser SDK.
 * @param {Object} details Registration details including event and participant info.
 * @param {Object} event Event details (date, time, venue, etc.)
 */
export const sendConfirmationEmail = async (details, event) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Validate environment variables
  if (
    !serviceId || 
    !templateId || 
    !publicKey || 
    serviceId.includes("PLACEHOLDER") || 
    templateId.includes("PLACEHOLDER") || 
    publicKey.includes("PLACEHOLDER")
  ) {
    console.warn("EmailJS: Credentials are not configured. Email dispatch skipped.");
    throw new Error("EmailJS keys are not configured in environment variables.");
  }

  const origin = window.location.origin || "https://event-portal-tan.vercel.app";
  const verifyLink = `${origin}/verify/${details.registrationId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyLink)}`;

  // Map fields matching the request template with comprehensive fallbacks
  const templateParams = {
    participant_name: details.recipientName || details.name,
    name: details.recipientName || details.name,
    to_name: details.recipientName || details.name,
    recipient_name: details.recipientName || details.name,
    
    event_name: details.eventTitle,
    registration_id: details.registrationId,
    event_date: event?.date || "TBD",
    event_venue: event?.venue || "TBD",
    college_name: details.collegeName,
    department: details.department,
    
    phone_number: details.recipientPhone || details.phone,
    phone: details.recipientPhone || details.phone,
    
    to_email: details.recipientEmail || details.email, 
    email: details.recipientEmail || details.email,
    recipient_email: details.recipientEmail || details.email,
    
    qr_code_url: qrCodeUrl,
    qr_code: qrCodeUrl,
    qrcode: qrCodeUrl,
    qr: qrCodeUrl,
    verification_link: verifyLink,
    verify_link: verifyLink,
    
    from_name: "V.S.B. Engineering College, Karur",
    reply_to: "no-reply@vsb.edu"
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("EmailJS: Confirmation email sent successfully!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("EmailJS: Failed to dispatch confirmation email:", error);
    throw error;
  }
};

/**
 * Sends a response email to a participant's query.
 * @param {Object} queryDetails Participant query data (name, email, queryType, message)
 * @param {String} responseMessage Response message written by the admin
 */
export const sendQueryResponseEmail = async (queryDetails, responseMessage) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const templateParams = {
    to_name: queryDetails.name,
    recipient_name: queryDetails.name,
    name: queryDetails.name,
    to_email: queryDetails.email,
    recipient_email: queryDetails.email,
    email: queryDetails.email,
    query_type: queryDetails.queryType || "Inquiry",
    original_message: queryDetails.message,
    response_message: responseMessage,
    admin_response: responseMessage,
    message: responseMessage,
    from_name: "VSB Event Portal Coordination Team",
    reply_to: "events@vsb.ac.in"
  };

  // Try EmailJS dispatch if credentials exist
  if (
    serviceId &&
    templateId &&
    publicKey &&
    !serviceId.includes("PLACEHOLDER") &&
    !templateId.includes("PLACEHOLDER") &&
    !publicKey.includes("PLACEHOLDER")
  ) {
    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log("EmailJS: Query response email sent successfully!");
    } catch (err) {
      console.warn("EmailJS send failed, opening mailto fallback launcher:", err);
    }
  }

  // Also launch mailto link so admin can review or send directly from default mail client
  const subject = encodeURIComponent(`[VSB Event Portal] Response to your inquiry: ${queryDetails.queryType || 'General Inquiry'}`);
  const body = encodeURIComponent(
    `Dear ${queryDetails.name},\n\nThank you for reaching out to the VSB Event Portal team.\n\n` +
    `--- Your Original Inquiry ---\n"${queryDetails.message}"\n\n` +
    `--- Admin Response ---\n${responseMessage}\n\n` +
    `Best regards,\nVSB Event Portal Coordination Team\nVSB Engineering College, Karur\nevents@vsb.ac.in`
  );
  
  // Trigger mailto client launcher safely
  setTimeout(() => {
    window.location.href = `mailto:${queryDetails.email}?subject=${subject}&body=${body}`;
  }, 300);

  return { success: true };
};
