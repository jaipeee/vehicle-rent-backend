import { env } from "../config/env";

interface LeadRow {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  vehicleType?: string;
  eventType?: string;
  message?: string;
  createdAt: string;
}

/**
 * Pushes a lead row to SheetDB or Sheety. Both take a plain HTTPS URL you
 * generate from your Google Sheet/Excel file, put it in SHEET_API_URL, and
 * optionally an API key in SHEET_API_KEY if your plan requires auth.
 *
 * Body shape below matches SheetDB's format ({ data: [...] }).
 * If you're using Sheety instead, change the body to:
 *   JSON.stringify({ <yourSheetTabName>: row })
 * (Sheety wraps the row under the sheet's tab name rather than "data".)
 */
export async function appendLeadToSheet(row: LeadRow) {
  if (!env.SHEET_API_URL) return; // integration is optional — skip if not configured

  const res = await fetch(env.SHEET_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.SHEET_API_KEY ? { Authorization: `Bearer ${env.SHEET_API_KEY}` } : {}),
    },
    body: JSON.stringify({ data: [row] }),
  });

  if (!res.ok) {
    throw new Error(`Sheet API responded with ${res.status}`);
  }
}