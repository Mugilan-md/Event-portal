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
  const templateId = import.meta.env.VITE_EMAILJS_QUERY_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const templateParams = {
    // Recipient & Participant Name aliases
    to_name: queryDetails.name,
    recipient_name: queryDetails.name,
    participant_name: queryDetails.name,
    name: queryDetails.name,
    
    // Email aliases
    to_email: queryDetails.email,
    recipient_email: queryDetails.email,
    email: queryDetails.email,
    
    // Inquiry & Admin Response content
    query_type: queryDetails.queryType || "General Inquiry",
    original_message: queryDetails.message,
    response_message: responseMessage,
    admin_response: responseMessage,
    message: responseMessage,
    details: `Inquiry: "${queryDetails.message}"\n\nAdmin Response:\n${responseMessage}`,

    // Event & Registration field fallbacks in case single template is used in EmailJS
    event_name: `Response to ${queryDetails.queryType || "Inquiry"}`,
    registration_id: "QUERY-RESPONSE",
    event_date: formattedDate,
    event_venue: "Online Support Desk",
    college_name: queryDetails.college || "VSB Engineering College",
    department: "Support & Coordination Desk",
    phone_number: queryDetails.phone || "N/A",
    
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
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log("EmailJS: Query response email sent successfully!", response.status, response.text);
      return { success: true, method: "emailjs" };
    } catch (err) {
      console.warn("EmailJS send failed, triggering mailto fallback launcher:", err);
    }
  }

  // Fallback: launch mailto link if EmailJS is not configured or failed
  const subject = encodeURIComponent(`[VSB Event Portal] Response to your inquiry: ${queryDetails.queryType || 'General Inquiry'}`);
  const body = encodeURIComponent(
    `Dear ${queryDetails.name},\n\nThank you for reaching out to the VSB Event Portal team.\n\n` +
    `--- Your Original Inquiry ---\n"${queryDetails.message}"\n\n` +
    `--- Admin Response ---\n${responseMessage}\n\n` +
    `Best regards,\nVSB Event Portal Coordination Team\nVSB Engineering College, Karur\nevents@vsb.ac.in`
  );
  
  setTimeout(() => {
    window.location.href = `mailto:${queryDetails.email}?subject=${subject}&body=${body}`;
  }, 300);

  return { success: true, method: "mailto" };
};
