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

  // Map fields matching the request template
  const templateParams = {
    participant_name: details.recipientName || details.name,
    event_name: details.eventTitle,
    registration_id: details.registrationId,
    event_date: event?.date || "TBD",
    event_venue: event?.venue || "TBD",
    college_name: details.collegeName,
    department: details.department,
    phone_number: details.recipientPhone || details.phone,
    to_email: details.recipientEmail || details.email, // Address destination for EmailJS dashboard setting
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
