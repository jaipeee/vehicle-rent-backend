import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEnquiryNotification(params: {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  vehicleType?: string;
  eventType?: string;
  message?: string;
}) {
  await resend.emails.send({
    from: env.NOTIFY_EMAIL_FROM,
    to: env.NOTIFY_EMAIL_TO,
    subject: `New enquiry from ${params.name}`,
    html: `
      <h2>New Enquiry — Indiventure Tour & Travel</h2>
      <p><strong>Name:</strong> ${params.name}</p>
      <p><strong>Phone:</strong> ${params.phone}</p>
      <p><strong>Email:</strong> ${params.email ?? "-"}</p>
      <p><strong>City:</strong> ${params.city ?? "-"}</p>
      <p><strong>Vehicle Type:</strong> ${params.vehicleType ?? "-"}</p>
      <p><strong>Event Type:</strong> ${params.eventType ?? "-"}</p>
      <p><strong>Message:</strong> ${params.message ?? "-"}</p>
    `,
  });
}