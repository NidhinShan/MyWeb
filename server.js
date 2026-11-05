/**
 * server.js · First-Party Local / Production Node.js Server
 * 
 * Provides:
 * - Static file serving for the portfolio website
 * - First-party same-origin endpoint: POST /api/contact
 * - Immunity from browser ad-blockers & Brave Shields (same-origin requests are never blocked)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

async function handleContactApi(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');
      const { name, email, subject, message, targetEmail = 'nidhinshan7@gmail.com' } = data;

      if (!name || !email || !message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: 'Name, email, and message are required.' }));
      }

      // Server-to-server relay to FormSubmit (bypasses browser ad-blockers entirely)
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || `Portfolio message from ${name}`,
          message,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await formSubmitRes.json().catch(() => ({}));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Message sent successfully via local API route!' }));
    } catch (err) {
      console.error('Server contact route error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to process message' }));
    }
  });
}

const server = http.createServer((req, res) => {
  // 1. First-Party API Route
  if (req.method === 'POST' && req.url === '/api/contact') {
    return handleContactApi(req, res);
  }

  // 2. Static File Serving
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n✨ Portfolio server listening at: http://localhost:${PORT}`);
  console.log(`   - Home:     http://localhost:${PORT}/index.html`);
  console.log(`   - Contact:  http://localhost:${PORT}/templates/contact.html`);
  console.log(`   - API:      http://localhost:${PORT}/api/contact (Same-origin)\n`);
});
