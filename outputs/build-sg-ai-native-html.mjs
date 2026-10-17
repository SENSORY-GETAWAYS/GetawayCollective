import fs from 'node:fs';

const input = new URL('./SG-AI-Native-Organisation-Design-for-Execution.md', import.meta.url);
const output = new URL('./SG-AI-Native-Organisation-Design-for-Execution.html', import.meta.url);
const md = fs.readFileSync(input, 'utf8').replace(/\r/g, '');

const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inline = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/`(.+?)`/g, '<code>$1</code>');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const lines = md.split('\n');
let html = '', list = null, paragraph = [], i = 0;
const toc = [];
const flushP = () => { if (paragraph.length) { html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph=[]; } };
const closeList = () => { if (list) { html += `</${list}>`; list=null; } };

while (i < lines.length) {
  const line = lines[i];
  if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s|:-]+\|?$/.test(lines[i+1])) {
    flushP(); closeList();
    const rows=[];
    while (i < lines.length && /^\|/.test(lines[i])) {
      rows.push(lines[i].split('|').slice(1,-1).map(x=>x.trim())); i++;
    }
    const head=rows[0]; const body=rows.slice(2);
    html += `<div class="table-wrap"><table><thead><tr>${head.map(x=>`<th>${inline(x)}</th>`).join('')}</tr></thead><tbody>${body.map(r=>`<tr>${r.map(x=>`<td>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    continue;
  }
  const h = line.match(/^(#{1,3})\s+(.+)$/);
  if (h) {
    flushP(); closeList();
    const level=h[1].length, title=h[2], id=slug(title);
    if (level <= 2) toc.push({level,title:title.replace(/^\d+\.\s*/,''),id});
    html += `<h${level} id="${id}">${inline(title)}</h${level}>`;
    i++; continue;
  }
  if (/^>\s?/.test(line)) {
    flushP(); closeList();
    const q=[]; while(i<lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/,'')); i++; }
    html += `<blockquote><span class="quote-mark">“</span>${inline(q.join(' '))}</blockquote>`; continue;
  }
  const ul=line.match(/^[-*]\s+(.+)$/), ol=line.match(/^\d+\.\s+(.+)$/);
  if (ul || ol) {
    flushP(); const type=ul?'ul':'ol'; if(list!==type){closeList();html+=`<${type}>`;list=type;}
    html += `<li>${inline((ul||ol)[1])}</li>`; i++; continue;
  }
  if (!line.trim()) { flushP(); closeList(); i++; continue; }
  paragraph.push(line.trim()); i++;
}
flushP(); closeList();

html = html
  .replace(/^<h1[^>]*>[\s\S]*?<\/h1><h2[^>]*>[\s\S]*?<\/h2>/, '')
  .replace(/<h3 id="(l\d+-[^"]+)">([\s\S]*?)(?=<h3 id="l\d+-|<h2 id=|$)/g,
    (_, id, body) => {
      const title = body.match(/^([^<]+)<\/h3>/)?.[1] ?? id.toUpperCase();
      const content = body.replace(/^([^<]+)<\/h3>/, '');
      return `<section class="domain reveal" id="${id}"><div class="domain-index">${title}</div>${content}</section>`;
    });

const nav = toc.filter(x=>x.level===2 && x.id!=='ai-native-organisation-design-for-execution').map((x,n)=>`<a href="#${x.id}"><span>${String(n+1).padStart(2,'0')}</span>${esc(x.title)}</a>`).join('');

const document = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Sensory Getaways AI-native organisation design for governed autonomous execution.">
<title>Sensory Getaways — AI-Native Organisation Design</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@200;300;500;600&family=Playfair+Display:ital@0;1&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{--gc-void:#0A0A0A;--gc-void-panel:#121212;--gc-paper:#F2F2F2;--gc-paper-panel:#FFF;--gc-mist:#E8E8E6;--gc-ink:#0A0A0A;--gc-steel:#6B6B6B;--gc-steel-dim:#9A9A9A;--gc-forest:#0C3024;--gc-copper:#C79F6B;--gc-electric:#2061DE;--gc-hazard:#E8672E;--gc-critical:#FF3B30;--gc-confirm:#1FAA59;--hair:rgba(10,10,10,.14);--hair-inv:rgba(242,242,242,.16);--display:'Outfit',sans-serif;--body:'Inter',sans-serif;--mono:'Space Mono',monospace;--editorial:'Playfair Display',serif;--cinema:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:92px}body{margin:0;background:var(--gc-paper);color:var(--gc-ink);font-family:var(--body);font-size:15px;line-height:1.72;-webkit-font-smoothing:antialiased}.progress{position:fixed;z-index:1000;left:0;top:0;width:0;height:3px;background:var(--gc-copper)}.hud{position:fixed;z-index:900;top:3px;left:0;right:0;height:62px;background:rgba(10,10,10,.96);backdrop-filter:blur(12px);color:var(--gc-paper);display:flex;align-items:center;justify-content:space-between;padding:0 3vw;border-bottom:1px solid var(--hair-inv)}.brand{font:700 11px/1 var(--mono);letter-spacing:.15em;text-transform:uppercase}.brand b{color:var(--gc-copper)}.hud-meta{display:flex;gap:24px;color:var(--gc-steel-dim);font:10px/1 var(--mono);text-transform:uppercase;letter-spacing:.08em}.status{display:flex;align-items:center;gap:8px}.status i{width:7px;height:7px;background:var(--gc-confirm);display:block;animation:pulse 2.4s infinite}.menu{display:none;border:0;background:none;color:white;font:11px var(--mono)}
.hero{min-height:94vh;background:var(--gc-void);color:var(--gc-paper);display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,32vw);padding:150px 6vw 80px;position:relative;overflow:hidden}.hero:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.9%,rgba(242,242,242,.06) 50%,transparent 50.1%),linear-gradient(rgba(242,242,242,.045) 1px,transparent 1px);background-size:100% 100%,100% 96px;pointer-events:none}.eyebrow{font:10px/1.4 var(--mono);text-transform:uppercase;letter-spacing:.18em;color:var(--gc-copper)}h1{font:200 clamp(3.5rem,8vw,8rem)/.88 var(--display);letter-spacing:-.045em;text-transform:uppercase;max-width:10ch;margin:32px 0}.hero .deck{font:italic clamp(1.15rem,2vw,1.65rem)/1.45 var(--editorial);color:var(--gc-steel-dim);max-width:38ch}.hero-aside{align-self:end;border-top:1px solid var(--hair-inv);padding-top:24px;position:relative}.metric{padding:17px 0;border-bottom:1px solid var(--hair-inv);display:flex;justify-content:space-between;gap:20px}.metric span{font:10px var(--mono);color:var(--gc-steel-dim);text-transform:uppercase}.metric b{font:500 14px var(--display);text-align:right}.hero-note{position:absolute;bottom:26px;left:6vw;font:9px var(--mono);color:var(--gc-steel);letter-spacing:.12em;text-transform:uppercase}
.layout{display:grid;grid-template-columns:250px minmax(0,1fr);max-width:1500px;margin:auto}.toc{position:sticky;top:65px;height:calc(100vh - 65px);padding:54px 24px 40px;border-right:1px solid var(--hair);overflow:auto}.toc-label{font:10px var(--mono);color:var(--gc-steel);letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px}.toc a{display:grid;grid-template-columns:28px 1fr;gap:8px;text-decoration:none;color:var(--gc-steel);padding:7px 0;font:10px/1.35 var(--mono);border-bottom:1px solid transparent}.toc a:hover,.toc a.active{color:var(--gc-ink);border-color:var(--gc-copper)}.toc a span{color:var(--gc-copper)}main{min-width:0;padding:72px clamp(28px,6vw,96px) 120px;max-width:1160px}h2{font:300 clamp(2.2rem,4.5vw,4.6rem)/1 var(--display);text-transform:uppercase;letter-spacing:-.035em;margin:120px 0 32px;padding-top:12px;border-top:2px solid var(--gc-ink)}h3{font:500 1.15rem/1.2 var(--display);text-transform:uppercase;letter-spacing:.01em;margin:42px 0 12px}p{max-width:76ch;margin:0 0 18px;color:#292929}strong{font-weight:600}code{font:12px var(--mono);background:var(--gc-mist);padding:2px 5px}blockquote{position:relative;margin:44px 0;padding:36px 40px 36px 76px;background:var(--gc-forest);color:var(--gc-paper);font:italic clamp(1.2rem,2.2vw,1.8rem)/1.45 var(--editorial)}.quote-mark{position:absolute;left:25px;top:16px;font:4rem var(--editorial);color:var(--gc-copper)}ul,ol{max-width:76ch;margin:14px 0 30px;padding-left:22px}li{padding:5px 0 5px 8px}li::marker{color:var(--gc-copper);font-family:var(--mono)}.domain{margin:90px -32px 0;padding:0 32px 40px;border:1px solid var(--hair);background:var(--gc-paper-panel);position:relative}.domain .domain-index{margin:0 -32px;padding:18px 32px;background:var(--gc-void);color:var(--gc-paper);font:300 clamp(1.5rem,3vw,2.5rem)/1 var(--display);text-transform:uppercase}.domain h3{color:var(--gc-electric)}.domain p strong:first-child{font:10px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--gc-steel)}.table-wrap{overflow:auto;margin:32px 0 48px;border-top:3px solid var(--gc-ink)}table{width:100%;border-collapse:collapse;min-width:760px;font-size:12px;line-height:1.45}th{background:var(--gc-void);color:var(--gc-paper);font:10px var(--mono);letter-spacing:.07em;text-transform:uppercase;text-align:left;padding:14px;border-right:1px solid var(--hair-inv)}td{vertical-align:top;padding:16px 14px;border-right:1px solid var(--hair);border-bottom:1px solid var(--hair)}tbody tr:nth-child(even){background:var(--gc-mist)}footer{background:var(--gc-void);color:var(--gc-paper);padding:70px 6vw;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:end}footer .closing{font:300 clamp(2rem,4vw,4rem)/1 var(--display);text-transform:uppercase;max-width:16ch}footer .docmeta{text-align:right;color:var(--gc-steel-dim);font:10px/1.8 var(--mono);text-transform:uppercase}.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s var(--cinema),transform .6s var(--cinema)}.reveal.visible{opacity:1;transform:none}@keyframes pulse{50%{opacity:.3}}
@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:120px}.hero-aside{margin-top:80px}.layout{display:block}.toc{display:none;position:fixed;z-index:800;inset:65px 0 0;background:var(--gc-paper);height:auto;border:0;padding:30px;}.toc.open{display:block}.menu{display:block}.hud-meta{display:none}main{padding-left:24px;padding-right:24px}.domain{margin-left:0;margin-right:0}.domain,.domain .domain-index{padding-left:22px;padding-right:22px}.domain .domain-index{margin-left:-22px;margin-right:-22px}}
@media print{.hud,.progress,.toc{display:none!important}.hero{min-height:auto;padding:50px;background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.layout{display:block}main{max-width:none;padding:30px}.domain{break-inside:avoid;margin-top:30px}.reveal{opacity:1;transform:none}h2{break-after:avoid;margin-top:50px}footer{background:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
</style></head><body>
<div class="progress" aria-hidden="true"></div><header class="hud"><div class="brand">GC.SYSTEM <b>/ SG</b></div><div class="hud-meta"><span>EBOK v3.0</span><span>Execution Architecture</span><span class="status"><i></i>Controlled document</span></div><button class="menu" aria-expanded="false">INDEX</button></header>
<section class="hero"><div><div class="eyebrow">Sensory Getaways · Enterprise Operating Model · 2026</div><h1>AI-Native Organisation Design</h1><div class="deck">A governed system for human authority, bounded intelligence and autopilot execution.</div></div><aside class="hero-aside"><div class="metric"><span>Operating domains</span><b>12 connected layers</b></div><div class="metric"><span>Autonomy model</span><b>4 authority classes</b></div><div class="metric"><span>Execution unit</span><b>Governed packet</b></div><div class="metric"><span>Property boundary</span><b>Conversion before hosting</b></div></aside><div class="hero-note">Objects age · Systems evolve · Evidence compounds</div></section>
<div class="layout"><nav class="toc" aria-label="Document index"><div class="toc-label">Document index</div>${nav}</nav><main>${html}</main></div>
<footer><div class="closing">Intelligence may execute. Humans remain accountable.</div><div class="docmeta">Sensory Getaways<br>AI-native organisation design<br>GC design system · controlled edition</div></footer>
<script>
const bar=document.querySelector('.progress');addEventListener('scroll',()=>{const d=document.documentElement;bar.style.width=((d.scrollTop/(d.scrollHeight-d.clientHeight))*100)+'%'});
const sections=[...document.querySelectorAll('main h2[id]')],links=[...document.querySelectorAll('.toc a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}}),{rootMargin:'-15% 0px -75%'});sections.forEach(s=>io.observe(s));
const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>reveal.observe(e));
const menu=document.querySelector('.menu'),tocEl=document.querySelector('.toc');menu.onclick=()=>{const open=tocEl.classList.toggle('open');menu.setAttribute('aria-expanded',open)};tocEl.onclick=e=>{if(e.target.closest('a'))tocEl.classList.remove('open')};
</script></body></html>`;

fs.writeFileSync(output, document);
console.log(output.pathname);
