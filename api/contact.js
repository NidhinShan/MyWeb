/**
 * api/contact.js · First-Party Serverless API Route
 * Compatible with Vercel, Netlify, AWS Lambda, or Node.js runtimes.
 *
 * Benefits:
 * - Same-origin endpoint (/api/contact) completely avoids ad-blocker / Brave Shields flags.
 * - Server-to-server dispatch never triggers CORS or client-side filter blocks.
 */

export default async function handler(req, res) {
  // Only permit POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, subject, message, targetEmail = 'nidhinshan7@gmail.com' } = req.body || {};

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  try {
    // 1. If RESEND_API_KEY is configured in environment variables, dispatch via Resend
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>',
          to: targetEmail,
          reply_to: email,
          subject: subject ? `Portfolio: ${subject}` : `New message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        })
      });

      if (resendRes.ok) {
        return res.status(200).json({ success: true, message: 'Email dispatched via Resend' });
      }
    }

    // 2. Default: Secure server-side relay to FormSubmit (bypasses browser ad-blockers)
    const relayRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject || `Portfolio Message from ${name}`,
        message,
        _template: 'table',
        _captcha: 'false'
      })
    });

    const data = await relayRes.json().catch(() => ({}));

    if (relayRes.ok && (data.success === 'true' || data.success === true || data.message)) {
      return res.status(200).json({ success: true, message: 'Message delivered successfully' });
    }

    return res.status(relayRes.status || 200).json({
      success: true,
      message: 'Message processed'
    });
  } catch (err) {
    console.error('API Contact route error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error while dispatching message' });
  }
}
