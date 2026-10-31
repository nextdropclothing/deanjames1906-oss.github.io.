// Tiny local preview server: http://localhost:4321
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.woff': 'font/woff', '.xml': 'application/xml', '.yml': 'text/yaml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
const redirects = fs.existsSync(path.join(ROOT, '_redirects')) ? Object.fromEntries(fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8').trim().split('\n').map(l => l.split(/\s+/))) : {};
http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (redirects[u]) { res.writeHead(301, { Location: redirects[u] }); return res.end(); }
  let f = path.join(ROOT, u);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!u.endsWith('/')) { res.writeHead(301, { Location: u + '/' }); return res.end(); }
    f = path.join(f, 'index.html');
  }
  if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': TYPES['.html'] }); return res.end(fs.readFileSync(path.join(ROOT, '404.html'))); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 4321, () => console.log(`Preview: http://localhost:${process.env.PORT || 4321}`));
