const fs = require('fs');
const path = require('path');

const sourcePath = process.argv[2] || 'C:/Users/nkdes/.codex/attachments/70d99066-16d8-448a-95f1-fddc2e19cec0/pasted-text.txt';
const outputPath = process.argv[3] || 'C:/GC BUILD/GC-Sovereign-Spatial-Compiler.html';
const documentKind = process.argv[4] || 'SPATIAL INTELLIGENCE';
const documentTitle = process.argv[5] || 'Sovereign <em>Spatial</em> Intelligence';
const documentDeck = process.argv[6] || 'From constitutional specification to deterministic geometry: a complete narrative of how constrained systems let smaller models execute complex spatial, BIM, and material intent with frontier-like reliability.';
const raw = fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const lines = raw.split('\n');
const headingPattern = /^(?:(\d+)\.\s+|#{1,3}\s+(?:\d+\.\s+)?)(.+)$/;
const codeStart = /^(TASK:|CANON:|INPUT:|LAYOUT:|INVARIANTS:|VERIFY:|[a-z][a-z0-9_]*:|SGDS CONSTITUTION|CANONICAL CODEX|SITE MODEL|ADAPTATION ENGINE|SENSORY SPATIAL COMPILER|RAW MATERIAL|INPUT|OUTPUT)$/;
const codeLine = /^(?:\s{2,}|[│├└─▼↓↙↘→]|[A-Z][A-Z0-9_ /&().*+-]{3,}:?$|[-–]\s|[a-z][a-z0-9_]*:\s*$)/;

const sections = [];
let section = { number: '00', title: 'Premise', lines: [] };
for (const line of lines) {
  const match = line.match(headingPattern);
  if (match && line.length < 110) {
    if (section.lines.some((item) => item.trim())) sections.push(section);
    section = { number: (match[1] || String(sections.length + 1)).padStart(2, '0'), title: match[2], lines: [] };
  } else section.lines.push(line);
}
if (section.lines.some((item) => item.trim())) sections.push(section);

function renderInline(text) {
  const safe = escapeHtml(text);
  return safe
    .replace(/\b(Human = Canon|AI = Execution Engine|System = Deterministic Output)\b/g, '<strong>$1</strong>')
    .replace(/\b(SBM|SAEOS|SGDS|Spatial IR|BIM IR|Revit|Codex|Compiler|Material Compiler)\b/g, '<span class="signal">$1</span>');
}

function renderLines(items) {
  let html = '';
  let paragraph = [];
  let code = [];
  let fenced = false;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(' ').trim();
    if (text) {
      const isLead = text.length > 120 && /^(The important|The clean rule|That is|And this|Ultimately|This is)/.test(text);
      html += `<p class="${isLead ? 'lead' : ''}">${renderInline(text)}</p>`;
    }
    paragraph = [];
  };
  const flushCode = () => {
    if (!code.length) return;
    const content = code.join('\n').trimEnd();
    html += `<figure class="logic-block"><figcaption><span>STRUCTURED INTENT</span><span>${String(content.split('\n').length).padStart(2, '0')} LINES</span></figcaption><pre><code>${escapeHtml(content)}</code></pre></figure>`;
    code = [];
  };
  for (let i = 0; i < items.length; i++) {
    const line = items[i].replace(/\s+$/, '');
    if (/^```/.test(line.trim())) {
      flushParagraph();
      if (fenced) flushCode();
      fenced = !fenced;
      continue;
    }
    if (fenced) { code.push(line); continue; }
    if (!line.trim()) { flushParagraph(); flushCode(); continue; }
    const shortTitle = line.length < 78 && !/[.!?]$/.test(line) && /^(What|Site adaptation|The |A strong|So instead|For example|Capture|Then|Example|Imagine|Ultimately|Worked|And this|Today|Your |Within )/.test(line);
    if (shortTitle && !code.length) {
      flushParagraph();
      html += `<h3>${renderInline(line)}</h3>`;
      continue;
    }
    const next = items[i + 1] || '';
    if (code.length || codeStart.test(line.trim()) || codeLine.test(line) || (line.length < 34 && codeLine.test(next))) {
      flushParagraph(); code.push(line); continue;
    }
    flushCode(); paragraph.push(line.trim());
  }
  flushParagraph(); flushCode();
  return html;
}

const sectionHtml = sections.map((item, index) => {
  const tone = index % 5 === 1 || index % 5 === 4 ? 'dark' : 'light';
  const chapter = documentKind;
  return `<section class="chapter ${tone}" id="s-${item.number}-${index}">
    <div class="chapter-rail"><span>${item.number}</span><i></i><small>${chapter}</small></div>
    <article>
      <header class="chapter-head"><div class="kicker">${chapter} / ${String(index + 1).padStart(2, '0')}</div><h2>${renderInline(item.title)}</h2></header>
      <div class="prose">${renderLines(item.lines)}</div>
    </article>
  </section>`;
}).join('\n');

const navItems = sections.map((item, index) => `<a href="#s-${item.number}-${index}"><span>${item.number}</span>${escapeHtml(item.title)}</a>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GC.SYSTEM — ${documentKind}</title>
<meta name="description" content="A designed narrative of ${documentKind.toLowerCase()}.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@200;300;400;500&family=Playfair+Display:ital,wght@1,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{--void:#0a0a0a;--panel:#121212;--paper:#f2f2f2;--white:#fff;--mist:#e8e8e6;--ink:#0a0a0a;--steel:#6b6b6b;--dim:#9a9a9a;--line:rgba(10,10,10,.13);--line-inv:rgba(242,242,242,.15);--forest:#0c3024;--copper:#c79f6b;--electric:#2061de;--matrix:#39ff6a;--display:'Outfit',sans-serif;--body:'Inter',sans-serif;--mono:'Space Mono',monospace;--editorial:'Playfair Display',serif;--ease:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.68;-webkit-font-smoothing:antialiased}.progress{position:fixed;z-index:20;inset:0 auto auto 0;height:2px;background:var(--electric);width:0}.hud{position:fixed;z-index:15;top:0;left:0;right:0;height:56px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;background:rgba(242,242,242,.86);border-bottom:1px solid var(--line);backdrop-filter:blur(14px);font:10px var(--mono);letter-spacing:.12em}.hud b{font-size:12px;color:var(--ink)}.hud .status{display:flex;gap:9px;align-items:center;color:var(--steel)}.hud .status:before{content:'';width:6px;height:6px;background:var(--matrix);border-radius:50%;box-shadow:0 0 10px var(--matrix);animation:pulse 2s infinite}.menu-button{border:0;background:none;font:10px var(--mono);letter-spacing:.12em;cursor:pointer;padding:12px}.nav{position:fixed;z-index:30;inset:56px 0 0 auto;width:min(430px,100%);padding:32px;background:var(--void);color:var(--paper);transform:translateX(100%);transition:transform .6s var(--ease);overflow:auto}.nav.open{transform:none}.nav a{display:grid;grid-template-columns:42px 1fr;gap:12px;color:var(--dim);text-decoration:none;padding:14px 0;border-bottom:1px solid var(--line-inv);font:11px var(--mono);line-height:1.5}.nav a:hover{color:var(--paper)}.nav span{color:var(--copper)}
.hero{min-height:100svh;background:var(--void);color:var(--paper);display:grid;grid-template-columns:minmax(72px,8vw) 1fr;position:relative;overflow:hidden;padding-top:56px}.hero:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.9%,rgba(255,255,255,.08) 50%,transparent 50.1%),linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:100% 100%,100% 12.5%;pointer-events:none}.hero-rail{border-right:1px solid var(--line-inv);display:flex;align-items:center;justify-content:center}.hero-rail span{writing-mode:vertical-rl;transform:rotate(180deg);font:10px var(--mono);letter-spacing:.22em;color:var(--copper)}.hero-main{padding:clamp(48px,8vw,128px);align-self:center;position:relative}.eyebrow{font:10px var(--mono);letter-spacing:.2em;color:var(--copper);text-transform:uppercase}.hero h1{font:200 clamp(3.5rem,9.6vw,9rem)/.82 var(--display);letter-spacing:-.055em;text-transform:uppercase;margin:32px 0}.hero h1 em{font-family:var(--editorial);font-weight:500;text-transform:none;color:var(--copper)}.hero-copy{max-width:680px;color:var(--dim);font-size:clamp(1rem,1.5vw,1.25rem)}.hero-meta{display:grid;grid-template-columns:repeat(3,minmax(120px,1fr));max-width:760px;margin-top:64px;border-top:1px solid var(--line-inv)}.hero-meta div{padding:18px 18px 0 0}.hero-meta small{display:block;font:9px var(--mono);letter-spacing:.12em;color:var(--dim)}.hero-meta strong{display:block;margin-top:5px;font:12px var(--mono);font-weight:400}
.axiom{display:grid;grid-template-columns:repeat(3,1fr);background:var(--copper);color:var(--void)}.axiom div{padding:clamp(28px,5vw,72px);border-right:1px solid rgba(10,10,10,.22)}.axiom small{font:9px var(--mono);letter-spacing:.16em}.axiom strong{display:block;margin-top:14px;font:300 clamp(1.5rem,3vw,3rem) var(--display);text-transform:uppercase}
.chapter{display:grid;grid-template-columns:minmax(72px,8vw) 1fr;border-top:1px solid var(--line);content-visibility:auto;contain-intrinsic-size:900px}.chapter.dark{background:var(--void);color:var(--paper);border-color:var(--line-inv)}.chapter-rail{border-right:1px solid var(--line);display:flex;flex-direction:column;align-items:center;padding:72px 0;gap:18px}.dark .chapter-rail{border-color:var(--line-inv)}.chapter-rail>span{font:12px var(--mono);color:var(--copper)}.chapter-rail i{height:90px;width:1px;background:currentColor;opacity:.2}.chapter-rail small{writing-mode:vertical-rl;font:9px var(--mono);letter-spacing:.16em;color:var(--steel)}.chapter article{width:min(1120px,100%);padding:clamp(64px,9vw,128px) clamp(24px,8vw,112px)}.chapter-head{display:grid;grid-template-columns:180px 1fr;gap:32px;align-items:start;margin-bottom:64px}.kicker{font:9px var(--mono);color:var(--copper);letter-spacing:.15em;padding-top:12px}.chapter h2{font:300 clamp(2.2rem,5.5vw,5rem)/.94 var(--display);letter-spacing:-.04em;text-transform:uppercase;margin:0}.prose{max-width:900px}.prose p{max-width:72ch;margin:0 0 24px;color:var(--steel)}.dark .prose p{color:var(--dim)}.prose p.lead{font:500 italic clamp(1.25rem,2.3vw,2rem)/1.42 var(--editorial);color:inherit;max-width:60ch;margin:48px 0}.prose h3{font:300 clamp(1.5rem,3vw,2.7rem)/1.05 var(--display);letter-spacing:-.025em;margin:72px 0 24px;max-width:25ch}.signal{color:var(--electric);font-weight:500}.dark .signal{color:var(--matrix)}.logic-block{margin:40px 0 56px;border:1px solid var(--line);background:var(--white);box-shadow:12px 12px 0 var(--mist)}.dark .logic-block{background:var(--panel);border-color:var(--line-inv);box-shadow:12px 12px 0 #050505}.logic-block figcaption{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--line);font:9px var(--mono);letter-spacing:.13em;color:var(--steel)}.dark .logic-block figcaption{border-color:var(--line-inv)}pre{margin:0;padding:24px;overflow:auto;color:var(--forest);font:11px/1.85 var(--mono);tab-size:2}.dark pre{color:var(--matrix)}
.closing{background:var(--forest);color:var(--paper);padding:clamp(72px,12vw,180px) max(24px,8vw);text-align:center}.closing small{font:10px var(--mono);letter-spacing:.18em;color:var(--copper)}.closing h2{font:200 clamp(3rem,8vw,8rem)/.88 var(--display);text-transform:uppercase;letter-spacing:-.05em;margin:30px auto;max-width:12ch}.closing p{max-width:58ch;margin:auto;color:rgba(242,242,242,.66)}
@keyframes pulse{50%{opacity:.35}}@media(max-width:760px){.hero,.chapter{grid-template-columns:44px 1fr}.hero-main{padding:56px 22px}.hero-meta{grid-template-columns:1fr}.axiom{grid-template-columns:1fr}.axiom div{border-right:0;border-bottom:1px solid rgba(10,10,10,.2)}.chapter article{padding:64px 22px}.chapter-head{grid-template-columns:1fr;gap:14px}.chapter-rail{padding-top:68px}.hud{padding:0 12px}.hud .status{display:none}.logic-block{margin-left:-12px;margin-right:-12px;box-shadow:6px 6px 0 var(--mist)}pre{padding:18px;font-size:10px}.hero h1{font-size:clamp(3rem,15vw,5rem)}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.status:before{animation:none}.nav{transition:none}}
@media print{.hud,.progress,.nav{display:none}.hero{min-height:90vh;padding-top:0}.chapter{content-visibility:visible;break-inside:avoid}.logic-block{break-inside:avoid;box-shadow:none}}
</style></head><body>
<div class="progress" id="progress"></div><header class="hud"><b>GC.SYSTEM / ${documentKind}</b><div class="status">CANON CONNECTED · ${sections.length} MODULES</div><button class="menu-button" id="menu" aria-expanded="false" aria-controls="nav">INDEX +</button></header>
<nav class="nav" id="nav" aria-label="Document index">${navItems}</nav>
<main><section class="hero"><div class="hero-rail"><span>${documentKind} / 2026</span></div><div class="hero-main"><div class="eyebrow">A MACHINE-READABLE ARCHITECTURE FOR EXECUTION</div><h1>${documentTitle}</h1><p class="hero-copy">${escapeHtml(documentDeck)}</p><div class="hero-meta"><div><small>INPUT</small><strong>DESIGN INTENT</strong></div><div><small>OPERATION</small><strong>CODED PRODUCTION</strong></div><div><small>ASSURANCE</small><strong>VERIFY / REPEAT</strong></div></div></div></section>
<section class="axiom"><div><small>01 / INTENT</small><strong>Design = Instruction</strong></div><div><small>02 / OPERATION</small><strong>Tools = Memory</strong></div><div><small>03 / RESULT</small><strong>Quality = Repeatable</strong></div></section>
${sectionHtml}
<footer class="closing"><small>THE CAPABILITY GAP CLOSES OUTSIDE THE MODEL</small><h2>Compile intent. Verify reality.</h2><p>The Codex holds the DNA. The site supplies the forces. The compiler turns both into a typed, testable, reversible built world.</p></footer></main>
<script>const menu=document.getElementById('menu'),nav=document.getElementById('nav'),progress=document.getElementById('progress');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.textContent=open?'INDEX −':'INDEX +'});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='INDEX +'}});addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?scrollY/max*100:0)+'%'},{passive:true});</script>
</body></html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Built ${outputPath}`);
console.log(`${sections.length} narrative modules · ${raw.length} source characters · ${html.length} output characters`);
