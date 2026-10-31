// Generates the DEMO product photos used in the preview.
// Not part of the normal build. Delete static/uploads/demo-* once real photos are uploaded.
import sharp from 'sharp';
import fs from 'node:fs';

const W = 1000, H = 1250;

const shapes = {
  tee: c => `<path d="M330 330 L425 285 Q500 335 575 285 L670 330 L790 440 L720 515 L655 465 L655 930 L345 930 L345 465 L280 515 L210 440 Z" fill="${c}"/>
    <path d="M425 285 Q500 345 575 285" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="10"/>`,
  hoodie: c => `<path d="M360 330 Q500 190 640 330 L705 350 Q760 560 805 800 L735 820 L660 520 L660 950 L340 950 L340 520 L265 820 L195 800 Q240 560 295 350 Z" fill="${c}"/>
    <path d="M405 330 Q500 250 595 330 Q500 395 405 330 Z" fill="rgba(0,0,0,.28)"/>
    <path d="M400 690 L600 690 L630 830 L370 830 Z" fill="rgba(0,0,0,.12)"/>
    <rect x="340" y="905" width="320" height="45" fill="rgba(0,0,0,.12)"/>
    <line x1="470" y1="390" x2="465" y2="520" stroke="rgba(255,255,255,.35)" stroke-width="5"/><line x1="530" y1="390" x2="535" y2="520" stroke="rgba(255,255,255,.35)" stroke-width="5"/>`,
  trousers: c => `<path d="M355 240 L645 240 L690 1010 L545 1010 L500 500 L455 1010 L310 1010 Z" fill="${c}"/>
    <rect x="355" y="240" width="290" height="40" fill="rgba(0,0,0,.15)"/>
    <rect x="335" y="560" width="95" height="120" rx="8" fill="rgba(0,0,0,.14)"/><rect x="570" y="560" width="95" height="120" rx="8" fill="rgba(0,0,0,.14)"/>`,
  trainer: c => `<path d="M200 760 Q195 620 300 600 L470 520 Q525 495 570 540 L650 605 Q790 625 815 700 Q825 735 805 760 Z" fill="${c}"/>
    <path d="M195 760 L810 760 Q815 800 780 812 L225 812 Q195 805 195 760 Z" fill="rgba(255,255,255,.9)" stroke="rgba(0,0,0,.12)" stroke-width="4"/>
    <path d="M420 560 L520 690 M460 540 L560 670 M500 525 L600 650" stroke="rgba(0,0,0,.18)" stroke-width="8" stroke-linecap="round"/>
    <path d="M300 690 Q480 640 700 700" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="10"/>`,
  runner: c => `<path d="M190 740 Q185 600 290 585 L460 505 Q520 480 570 530 L655 600 Q800 615 820 700 Q828 730 810 740 Z" fill="${c}"/>
    <path d="M180 740 L825 740 Q835 810 790 830 L220 830 Q175 815 180 740 Z" fill="rgba(255,255,255,.92)" stroke="rgba(0,0,0,.14)" stroke-width="4"/>
    <path d="M200 785 L810 785" stroke="rgba(0,0,0,.1)" stroke-width="6"/>
    <path d="M330 640 Q470 560 620 640" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="14"/>`,
  dress: c => `<path d="M420 230 L580 230 L605 420 Q660 700 715 1020 L285 1020 Q340 700 395 420 Z" fill="${c}"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<line x1="${430+i*20}" y1="250" x2="${330+i*48}" y2="1010" stroke="rgba(0,0,0,.1)" stroke-width="4"/>`).join('')}`,
  puffer: c => `<path d="M330 330 Q500 260 670 330 L735 360 L800 740 L725 760 L665 520 L665 780 L335 780 L335 520 L275 760 L200 740 L265 360 Z" fill="${c}"/>
    ${[420,500,580,660,740].map(y=>`<path d="M335 ${y} Q500 ${y+18} 665 ${y}" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="6"/>`).join('')}
    <line x1="500" y1="300" x2="500" y2="780" stroke="rgba(255,255,255,.4)" stroke-width="5"/>
    <path d="M420 300 Q500 270 580 300 L580 345 Q500 320 420 345 Z" fill="rgba(0,0,0,.25)"/>`,
  watch: c => `<rect x="430" y="200" width="140" height="280" rx="20" fill="#2a2a2a"/><rect x="430" y="770" width="140" height="280" rx="20" fill="#2a2a2a"/>
    <circle cx="500" cy="625" r="185" fill="${c}"/><circle cx="500" cy="625" r="155" fill="#101010"/>
    ${[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return `<line x1="${500+135*Math.sin(a)}" y1="${625-135*Math.cos(a)}" x2="${500+120*Math.sin(a)}" y2="${625-120*Math.cos(a)}" stroke="#ddd" stroke-width="5"/>`}).join('')}
    <line x1="500" y1="625" x2="500" y2="525" stroke="#eee" stroke-width="7" stroke-linecap="round"/><line x1="500" y1="625" x2="570" y2="660" stroke="#eee" stroke-width="7" stroke-linecap="round"/>
    <rect x="680" y="605" width="30" height="40" rx="6" fill="${c}"/>`,
  chain: c => [...Array(19)].map((_,i)=>{const t=i/18*Math.PI;const x=500-300*Math.cos(t);const y=330+520*Math.sin(t);return `<ellipse cx="${x}" cy="${y}" rx="34" ry="22" transform="rotate(${(i%2?40:-40)+ (t*57-90)} ${x} ${y})" fill="none" stroke="${c}" stroke-width="16"/>`}).join(''),
  set: c => `<path d="M220 250 Q330 190 440 250 L480 275 L520 560 L470 570 L430 400 L430 620 L230 620 L230 400 L190 570 L140 560 L180 275 Z" fill="${c}"/>
    <path d="M560 340 L790 340 L830 1000 L715 1000 L675 580 L635 1000 L520 1000 Z" fill="${c}"/>
    <rect x="560" y="340" width="230" height="34" fill="rgba(0,0,0,.15)"/><rect x="230" y="590" width="200" height="30" fill="rgba(0,0,0,.15)"/>`,
  bag: c => `<path d="M300 620 Q500 160 700 620" fill="none" stroke="#222" stroke-width="22"/>
    <rect x="270" y="600" width="460" height="330" rx="50" fill="${c}"/>
    <rect x="270" y="600" width="460" height="120" rx="50" fill="rgba(0,0,0,.18)"/><line x1="320" y1="760" x2="680" y2="760" stroke="rgba(255,255,255,.35)" stroke-width="6"/>`,
  beanie: c => `<path d="M290 720 Q290 330 500 320 Q710 330 710 720 Z" fill="${c}"/>
    <rect x="270" y="690" width="460" height="170" rx="24" fill="${c}"/><rect x="270" y="690" width="460" height="170" rx="24" fill="rgba(0,0,0,.14)"/>
    ${[...Array(15)].map((_,i)=>`<line x1="${300+i*28}" y1="700" x2="${300+i*28}" y2="850" stroke="rgba(0,0,0,.16)" stroke-width="5"/>`).join('')}`,
};

function svg(shape, colour, dark) {
  const bg1 = dark ? '#262626' : '#f1f0ed', bg2 = dark ? '#0d0d0d' : '#dcdbd7';
  const label = dark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><radialGradient id="bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></radialGradient>
  <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
  <filter id="blur"><feGaussianBlur stdDeviation="22"/></filter><filter id="ds"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-opacity="${dark ? .6 : .22}"/></filter>
  <mask id="m"><g fill="#fff" stroke="#fff">${shapes[shape]('#fff')}</g></mask></defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <ellipse cx="500" cy="1070" rx="330" ry="34" fill="#000" opacity="${dark ? .5 : .14}" filter="url(#blur)"/>
  <g filter="url(#ds)">${shapes[shape](colour)}</g>
  <rect width="100%" height="100%" fill="url(#sh)" mask="url(#m)"/>
  <text x="44" y="${H - 44}" font-family="DejaVu Sans" font-size="22" letter-spacing="4" fill="${label}">DEMO IMAGE</text>
</svg>`;
}

const items = [
  ['nd001', 'hoodie', '#1b1b1b', '#5a5a5a'],
  ['nd002', 'tee', '#fafafa', '#151515'],
  ['nd003', 'trousers', '#202020', '#6b6650'],
  ['nd004', 'trainer', '#f5f5f5', '#1c1c1c'],
  ['nd005', 'runner', '#9a9da1', '#e8e2d4'],
  ['nd006', 'dress', '#181818', '#6b5546'],
  ['nd007', 'puffer', '#141414', '#b9bcc0'],
  ['nd008', 'watch', '#c9ccd0', '#3a3a3a'],
  ['nd009', 'chain', '#c7cace', '#e0e3e6'],
  ['nd010', 'set', '#3a3a3c', '#151515'],
  ['nd011', 'set', '#d8cfc0', '#8d8d8d'],
  ['nd012', 'bag', '#161616', '#2c2c2c'],
  ['nd013', 'beanie', '#1a1a1a', '#7b7b7b'],
];
fs.mkdirSync('static/uploads', { recursive: true });
for (const [ref, shape, c1, c2] of items) {
  await sharp(Buffer.from(svg(shape, c1, false))).jpeg({ quality: 86, mozjpeg: true }).toFile(`static/uploads/demo-${ref}-1.jpg`);
  await sharp(Buffer.from(svg(shape, c2, true))).jpeg({ quality: 86, mozjpeg: true }).toFile(`static/uploads/demo-${ref}-2.jpg`);
}

// Hero background (editorial dark gradient, subtle light sweep)
const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500">
<defs><radialGradient id="g" cx="72%" cy="35%" r="70%"><stop offset="0" stop-color="#4a4b4d"/><stop offset=".45" stop-color="#1a1a1b"/><stop offset="1" stop-color="#050505"/></radialGradient>
<linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="n"><feTurbulence baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .05 0"/></filter></defs>
<rect width="100%" height="100%" fill="url(#g)"/><polygon points="1250,0 1750,0 1050,1500 550,1500" fill="url(#l)"/><polygon points="1850,0 2050,0 1350,1500 1150,1500" fill="url(#l)"/>
<rect width="100%" height="100%" filter="url(#n)"/></svg>`;
await sharp(Buffer.from(hero)).jpeg({ quality: 82, mozjpeg: true }).toFile('static/uploads/hero-default.jpg');
console.log('demo images written');
