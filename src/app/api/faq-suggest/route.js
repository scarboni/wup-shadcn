/**
 * POST /api/faq-suggest
 *
 * Contact form FAQ deflection endpoint.
 * Accepts { subject, message } and returns matching FAQs
 * based on weighted keyword scoring.
 *
 * 🔧 PRODUCTION: Add rate limiting (lightweight — 30 req/min per IP).
 *    Consider caching results for identical input hashes.
 *    Migrate to semantic search (embeddings) if keyword matching
 *    proves insufficient for match quality.
 */

import { matchFAQs } from "@/data/faq-data";

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject = "", message = "" } = body;

    // Basic input validation — don't process empty or very short input
    const combined = `${subject} ${message}`.trim();
    if (combined.length < 3) {
      return Response.json({ suggestions: [] });
    }

    const suggestions = matchFAQs(subject, message, {
      threshold: 3,
      maxResults: 3,
    });

    return Response.json({ suggestions });
  } catch (_err) {
    return Response.json({ suggestions: [] });
  }
}
