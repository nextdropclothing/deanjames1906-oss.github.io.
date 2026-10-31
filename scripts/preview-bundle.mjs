// Dev tool: packs the built site (dist/) into ONE self-contained HTML file for a quick shareable preview.
// The real website is dist/ deployed to Netlify — this file is only for previewing.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const D = path.join(ROOT, 'dist');
const b64 = (f, mime) => `data:${mime};base64,${fs.readFileSync(path.join(D, f)).toString('base64')}`;

const pages = {};
function walk(dir) {
  for (const e of fs.readdirSync(path.join(D, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory() && !['admin', 'img', 'uploads', 'fonts', 'brand', 'assets'].includes(e.name)) walk(rel);
    else if (e.name === 'index.html') pages['/' + (dir ? dir + '/' : '')] = fs.readFileSync(path.join(D, rel), 'utf8');
  }
}
walk('');
const routeOf = u => {
  if (u === '/') return 'home';
  return u.replace(/^\/|\/$/g, '').replace(/\//g, '-');
};
const images = {};
const fix = html => html
  .replace(/ srcset="[^"]*"/g, '').replace(/ sizes="[^"]*"/g, '')
  .replace(/src="\/img\/([^"]+)"/g, (_, f) => { images[f] ??= b64('img/' + f, 'image/webp'); return `src="" data-img="${f}"`; })
  .replace(/src="\/brand\/([^"]+)"/g, (_, f) => { images['b-' + f] ??= b64('brand/' + f, f.endsWith('png') ? 'image/png' : 'image/jpeg'); return `src="" data-img="b-${f}"`; })
  .replace(/href="\/shop\/#search"/g, 'href="#shop"')
  .replace(/href="(\/[^"#?]*)"/g, (m, u) => pages[u] ? `href="#${routeOf(u)}"` : m)
  .replace(/<form action="\/shop\/"[\s\S]*?<\/form>/, '');

const routes = {};
let shell = null;
for (const [u, html] of Object.entries(pages)) {
  const main = html.match(/<main id="main">([\s\S]*)<\/main>/)[1];
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  routes[routeOf(u)] = { title, html: fix(main) };
  if (u === '/') shell = html;
}
const notFound = fs.readFileSync(path.join(D, '404.html'), 'utf8');
routes['404'] = { title: 'Page not found', html: fix(notFound.match(/<main id="main">([\s\S]*)<\/main>/)[1]) };

let css = fs.readFileSync(path.join(D, shell.match(/href="(\/assets\/styles[^"]+)"/)[1]), 'utf8')
  .replace(/url\(\/fonts\/([^)]+)\)/g, (_, f) => `url(${b64('fonts/' + f, 'font/woff')})`);
const js = fs.readFileSync(path.join(D, shell.match(/src="(\/assets\/app[^"]+)"/)[1]), 'utf8');

let out = shell
  .replace(/<link rel="(icon|apple-touch-icon|manifest|preload|canonical)"[^>]*>\n?/g, '')
  .replace(/<link rel="stylesheet"[^>]*>/, () => `<style>${css}</style>`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
  .replace(/<main id="main">[\s\S]*<\/main>/, '<main id="main"></main>')
  .replace(/<script src="\/assets\/app[^"]+" defer><\/script>/, '');
out = fix(out);
const J = o => JSON.stringify(o).replace(/</g, '\\u003c');
out = out.replace('</body>', () => `<script>window.ND_PREVIEW=true;</script>
<script>const R=${J(routes)};const IMG=${J(images)};
function hydrate(root){root.querySelectorAll('img[data-img]').forEach(i=>{i.src=IMG[i.dataset.img]||'';i.removeAttribute('loading');});}
function go(){const k=(location.hash||'#home').slice(1);const r=R[k]||R['404'];const m=document.getElementById('main');m.innerHTML=r.html;hydrate(m);document.title=r.title;
document.querySelectorAll('.drawer.is-open').forEach(d=>{d.classList.remove('is-open');document.body.classList.remove('no-scroll');});
scrollTo(0,0);window.NDinit&&window.NDinit();}
hydrate(document);</script>
<script>${js.replace('window.NDinit();', '')}</script>
<script>addEventListener('hashchange',go);go();</script>
</body>`);
const target = path.join(ROOT, '..', 'nextdrop-preview.html');
fs.writeFileSync(target, out);
console.log('preview →', target, (out.length / 1024 / 1024).toFixed(2) + ' MB', Object.keys(routes).length, 'routes');
