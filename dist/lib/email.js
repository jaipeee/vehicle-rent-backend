"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEnquiryNotification = sendEnquiryNotification;
const resend_1 = require("resend");
const env_1 = require("../config/env");
const resend = new resend_1.Resend(env_1.env.RESEND_API_KEY);
async function sendEnquiryNotification(params) {
    await resend.emails.send({
        from: env_1.env.NOTIFY_EMAIL_FROM,
        to: env_1.env.NOTIFY_EMAIL_TO,
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
