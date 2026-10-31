const fs = require('fs');
const path = require('path');

const sourcePath = 'C:/Users/nkdes/.codex/attachments/209a9fe7-0db0-4fd8-8ca4-dce74e33cea3/pasted-text.txt';
const outputPath = 'C:/GC BUILD/GC-Factory-Operating-System-Book.html';
const source = fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const esc = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (value) => esc(value)
  .replace(/\b(SG|Spatial Compiler|Factory|Site|Product Passport|Interface Layer|assembly|assemblies)\b/g, '<span class="signal">$1</span>')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`(.+?)`/g, '<code>$1</code>');

const lines = source.split('\n');
const chapters = [];
let current = { title: 'Factory Production Law', lines: [] };
for (const line of lines) {
  const matched = line.match(/^#{1,2}\s+(?:\d+\.\s+)?(.+)$/);
  if (matched && line.length < 120) {
    if (current.lines.some((item) => item.trim())) chapters.push(current);
    current = { title: matched[1], lines: [] };
  } else current.lines.push(line);
}
if (current.lines.some((item) => item.trim())) chapters.push(current);

function render(linesForChapter) {
  let out = '';
  let paragraph = [];
  let code = [];
  let fenced = false;
  const flushP = () => {
    const text = paragraph.join(' ').trim();
    if (text) out += `<p class="${text.length > 190 && /^(The |This |That |Anything|Do not |You |For Sensory)/.test(text) ? 'lead' : ''}">${inline(text)}</p>`;
    paragraph = [];
  };
  const flushCode = () => {
    const text = code.join('\n').trimEnd();
    if (text) out += `<div class="instruction"><div class="instruction-label">OPERATING INSTRUCTION</div><pre>${esc(text)}</pre></div>`;
    code = [];
  };
  for (const raw of linesForChapter) {
    const line = raw.replace(/\s+$/, '');
    if (/^```/.test(line.trim())) { flushP(); if (fenced) flushCode(); fenced = !fenced; continue; }
    if (fenced) { code.push(line); continue; }
    if (!line.trim()) { flushP(); flushCode(); continue; }
    if (/^#{3}\s+/.test(line)) { flushP(); flushCode(); out += `<h3>${inline(line.replace(/^#{3}\s+/, ''))}</h3>`; continue; }
    if (/^[-*]\s+/.test(line)) { flushP(); out += `<p class="bullet">${inline(line.replace(/^[-*]\s+/, ''))}</p>`; continue; }
    paragraph.push(line.trim());
  }
  flushP(); flushCode();
  return out;
}

const toc = chapters.map((chapter, i) => `<a href="#page-${i + 1}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(chapter.title)}</a>`).join('');
const sheets = chapters.map((chapter, i) => `<section class="sheet" id="page-${i + 1}"><header class="page-head"><span>GC.SYSTEM / FACTORY OPERATING SYSTEM</span><span>CHAPTER ${String(i + 1).padStart(2, '0')}</span></header><div class="page-content"><div class="chapter-mark">${String(i + 1).padStart(2, '0')}</div><h2>${inline(chapter.title)}</h2><div class="rule"></div><article>${render(chapter.lines)}</article></div><footer class="page-foot"><span>PRECISION HALF OF THE BUILDING</span><span>${String(i + 1).padStart(3, '0')}</span></footer></section>`).join('\n');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GC.SYSTEM — Factory Operating System</title><meta name="description" content="A print-native knowledge book for the factory precision half of the building."><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@200;300;400;500&family=Playfair+Display:ital,wght@1,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"><style>
:root{--paper:#f7f6f2;--white:#fff;--ink:#121212;--steel:#666762;--muted:#999994;--line:#d8d7d1;--wash:#ecebe5;--copper:#9e7748;--electric:#245cc5;--forest:#183c30;--display:'Outfit',sans-serif;--body:'Inter',sans-serif;--mono:'Space Mono',monospace;--editorial:'Playfair Display',serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#e9e8e3;color:var(--ink);font:14px/1.63 var(--body);-webkit-font-smoothing:antialiased}.toolbar{position:sticky;top:0;z-index:5;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(247,246,242,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(10px);font:10px var(--mono);letter-spacing:.1em}.toolbar button{border:1px solid var(--ink);padding:8px 13px;background:transparent;font:10px var(--mono);cursor:pointer}.contents{display:none;position:fixed;z-index:10;top:56px;right:0;width:min(460px,100%);max-height:calc(100vh - 56px);overflow:auto;padding:30px;background:var(--paper);border-left:1px solid var(--line);border-bottom:1px solid var(--line)}.contents.open{display:block}.contents h2{font:300 1.6rem var(--display);text-transform:uppercase;margin:0 0 20px}.contents a{display:grid;grid-template-columns:42px 1fr;gap:10px;padding:10px 0;border-top:1px solid var(--line);color:var(--steel);text-decoration:none;font:10px/1.45 var(--mono)}.contents a span{color:var(--copper)}.book-cover,.sheet{width:210mm;min-height:297mm;margin:22px auto;background:var(--paper);box-shadow:0 1px 6px rgba(0,0,0,.08);position:relative}.book-cover{padding:26mm 25mm;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(120deg,#f7f6f2 0%,#f7f6f2 65%,#eeece5 65%,#eeece5 100%)}.cover-top,.page-head,.page-foot{display:flex;justify-content:space-between;font:8.5px var(--mono);letter-spacing:.13em;color:var(--steel)}.cover-top b{color:var(--ink)}.cover-title{margin:20mm 0}.cover-title small{font:10px var(--mono);letter-spacing:.18em;color:var(--copper)}.cover-title h1{font:200 6rem/.82 var(--display);letter-spacing:-.06em;text-transform:uppercase;margin:20px 0}.cover-title h1 em{font:500 italic 5.8rem var(--editorial);text-transform:none;color:var(--copper)}.cover-copy{max-width:51ch;font-size:16px;color:var(--steel)}.cover-law{border-top:1px solid var(--ink);padding-top:18px;max-width:72ch;font:500 italic 1.6rem/1.38 var(--editorial)}.sheet{padding:15mm 18mm 15mm;display:flex;flex-direction:column;break-after:page;page-break-after:always}.page-head{padding-bottom:8mm;border-bottom:1px solid var(--line)}.page-content{display:grid;grid-template-columns:24mm minmax(0,1fr);gap:9mm;flex:1;padding:13mm 0}.chapter-mark{font:300 2.3rem/.8 var(--display);color:var(--copper);padding-top:5px}.page-content h2{grid-column:2;font:300 3rem/.93 var(--display);letter-spacing:-.04em;text-transform:uppercase;margin:0;max-width:18ch}.page-content .rule{grid-column:2;height:1px;background:var(--ink);margin:5mm 0 7mm}.page-content article{grid-column:2;max-width:132mm}.page-foot{border-top:1px solid var(--line);padding-top:5mm}.page-foot span:last-child{color:var(--copper)}p{margin:0 0 4.5mm;color:var(--steel)}p.lead{font:500 italic 1.27rem/1.42 var(--editorial);color:var(--ink);margin:0 0 8mm}.signal{color:var(--electric);font-weight:500}.bullet{padding-left:16px;position:relative}.bullet:before{content:'—';position:absolute;left:0;color:var(--copper)}h3{font:500 10px var(--mono);letter-spacing:.12em;text-transform:uppercase;margin:10mm 0 4mm;color:var(--ink)}strong{color:var(--ink)}code{font:10px var(--mono);color:var(--forest)}.instruction{margin:7mm 0 8mm;border:1px solid var(--line);background:var(--white);break-inside:avoid;page-break-inside:avoid}.instruction-label{padding:3mm 4mm;border-bottom:1px solid var(--line);font:8px var(--mono);letter-spacing:.14em;color:var(--copper)}pre{margin:0;padding:4mm;overflow:hidden;white-space:pre-wrap;font:9px/1.65 var(--mono);color:var(--forest)}@page{size:A4;margin:0}@media(max-width:850px){body{background:var(--paper)}.book-cover,.sheet{width:100%;min-height:100vh;margin:0;box-shadow:none}.book-cover{padding:32px 24px}.sheet{padding:26px 22px}.cover-title h1{font-size:clamp(3.5rem,18vw,6rem)}.cover-title h1 em{font-size:clamp(3rem,16vw,5.8rem)}.page-content{grid-template-columns:42px 1fr;gap:12px}.page-content h2,.page-content .rule,.page-content article{grid-column:2}.page-content h2{font-size:clamp(2rem,10vw,3rem)}}@media print{body{background:var(--paper)}.toolbar,.contents{display:none!important}.book-cover,.sheet{width:210mm;height:297mm;min-height:297mm;margin:0;box-shadow:none;overflow:hidden}.sheet{break-after:page;page-break-after:always}.instruction{break-inside:avoid;page-break-inside:avoid}a{color:inherit;text-decoration:none}}
</style></head><body><header class="toolbar"><span><b>GC.SYSTEM</b> / FACTORY KNOWLEDGE BOOK</span><button id="contents-button" aria-expanded="false">CONTENTS +</button></header><nav class="contents" id="contents"><h2>Chapter register</h2>${toc}</nav><main><section class="book-cover"><div class="cover-top"><b>GC.SYSTEM</b><span>KNOWLEDGE BOOK / 01</span></div><div class="cover-title"><small>THE PRECISION HALF OF THE BUILDING</small><h1>Factory<br><em>Operating</em><br>System</h1><p class="cover-copy">A page-by-page instruction set for transforming building assemblies into factory products, controlled interfaces, sequenced crates, dry connections, and reliable commissioning.</p></div><div class="cover-law">“Fragment technically. Integrate perceptually.”</div><div class="cover-top"><span>LIGHT EDITION / PRINT READY</span><span>${String(chapters.length).padStart(2, '0')} CHAPTERS</span></div></section>${sheets}</main><script>const b=document.getElementById('contents-button'),c=document.getElementById('contents');b.addEventListener('click',()=>{const o=c.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'CONTENTS −':'CONTENTS +'});c.addEventListener('click',e=>{if(e.target.closest('a')){c.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='CONTENTS +'}})</script></body></html>`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Built ${outputPath}`);
console.log(`${chapters.length} print chapters · ${source.length} source characters · ${html.length} output characters`);
