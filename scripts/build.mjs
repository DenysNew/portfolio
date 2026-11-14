import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const profile = JSON.parse(await readFile(resolve(root, 'content/profile.json'), 'utf8'));
const projects = JSON.parse(await readFile(resolve(root, 'content/projects.json'), 'utf8'));
const out = resolve(root, 'dist');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M3 3h10v10" stroke="currentColor" stroke-width="1.4"/></svg>';
const external = l => `<a class="text-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ${arrow}</a>`;
function visual(p) {
  if (p.images.length) {
    const mixed = p.images.some(image => image.height > image.width);
    const gallery = p.images.map(({src,alt}) => ({src,alt}));
    const photos = `<button type="button" class="photo-stack${mixed?' photo-stack-mixed':''}${p.images.length===1?' photo-stack-single':''}" data-gallery="${esc(JSON.stringify(gallery))}" aria-haspopup="dialog" aria-controls="image-dialog" aria-label="Otwórz galerię: ${esc(p.name)} (${p.images.length})"><span class="photo-stack-pile" aria-hidden="true">${p.images.slice(0,4).map(image => `<span class="stack-photo${image.height>image.width?' portrait-photo':''}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy" width="${image.width}" height="${image.height}"></span>`).join('')}</span></button>`;
    if (!p.benchmark) return photos;
    return `<aside class="project-evidence" aria-label="Przykładowy wynik przetwarzania"><p class="benchmark-label">${esc(p.benchmark.label)}</p><dl class="benchmark"><div><dt>Nagranie</dt><dd>${esc(p.benchmark.input)}</dd></div><div><dt>Rozpoznawanie</dt><dd>${esc(p.benchmark.output)}</dd></div></dl><p class="benchmark-note">${esc(p.benchmark.note)}</p>${photos}</aside>`;
  }
  const process = p.process;
  if (!process?.steps?.length) throw new Error(`Missing process example: ${p.id}`);
  return `<figure class="project-visual visual-${esc(p.visual)}"><figcaption class="process-heading"><span class="visual-mark">${esc(process.label)}</span><strong>${esc(process.title)}</strong></figcaption><ol class="process-steps">${process.steps.map((step,i)=>`<li><span class="process-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><h4>${esc(step.title)}</h4><p>${esc(step.text)}</p></div></li>`).join('')}</ol><p class="process-note">${esc(process.note)}</p></figure>`;
}
function card(p, track, index) {
  return `<article class="project${p.compactHeading?' project-compact':''}${p.wideHeading?' project-wide-heading':''}" id="${track}-${p.id}">
    <div class="project-heading">${p.compactHeading?`<div class="project-title"><h3>${esc(p.name)}</h3><p class="project-subtitle">${esc(p.subtitle)}</p></div>`:`<span class="project-number">${String(index+1).padStart(2,'0')}</span>`}<span class="status ${esc(p.statusType)}"><i aria-hidden="true"></i>${esc(p.status)}</span></div>
    <div class="project-layout"><div class="project-copy">${p.compactHeading?'':`<p class="project-subtitle">${esc(p.subtitle)}</p><h3>${esc(p.name)}</h3>`}<p class="summary">${esc(p.summary)}</p>
    <p class="label">Moja rola</p>${p.roles.length===1?`<p class="role-summary">${esc(p.roles[0])}</p>`:`<ul class="role-list">${p.roles.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`}
    <ul class="tags" aria-label="Narzędzia i technologie">${p.stack.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
    ${p.links.length?`<div class="project-links">${p.links.map(external).join('')}</div>`:''}${p.linkNote?`<p class="project-link-note">${esc(p.linkNote)}</p>`:''}</div>${visual(p)}</div>
    <details class="project-details"><summary><span>Proces i szczegóły techniczne</span><span class="details-symbol" aria-hidden="true">+</span></summary><div class="details-grid">${p.details.map(d=>`<section><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p></section>`).join('')}</div></details>
  </article>`;
}
const contactCvs = profile.tracks.map(track => {
  const cv = profile.cvs.find(cv => cv.id === track.cvId);
  if (!cv) throw new Error(`Missing CV for track: ${track.id}`);
  return `<aside class="track-cv" data-track-cv="${esc(track.id)}" aria-labelledby="contact-cv-${esc(track.id)}"${track.id==='ai'?'':' hidden'}><p class="label">CV · PDF</p><h3 id="contact-cv-${esc(track.id)}">${esc(cv.label)}</h3><p class="track-cv-description">${esc(cv.description)}</p><div class="cv-direct-actions"><a class="button primary" href="${esc(cv.url)}" target="_blank" rel="noopener noreferrer" aria-label="Zobacz CV: ${esc(cv.label)} (PDF, nowa karta)">Zobacz CV ${arrow}</a><a class="cv-download" href="${esc(cv.url)}" download aria-label="Pobierz CV: ${esc(cv.label)} (PDF)">Pobierz PDF <span aria-hidden="true">↓</span></a></div><p class="language-note">${esc(profile.languages)}</p></aside>`;
}).join('');
const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Portfolio Denysa Nevskyi. Własne projekty AI i automatyzacji, praktyka administracji IT oraz laboratoria cyberbezpieczeństwa."><meta name="theme-color" content="#173b32"><meta name="color-scheme" content="light"><title>${esc(profile.name)} — ${esc(profile.title)}</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head>
<body><a class="skip-link" href="#portfolio">Przejdź do projektów</a>
<header class="site-header compact-header"><a href="#" class="brand" aria-label="Denys Nevskyi — początek strony"><span class="monogram" aria-hidden="true">DN<span>.</span></span><span class="brand-name">${esc(profile.name)}<small>${esc(profile.location)}</small></span></a><h1 class="header-tagline">Projekty, które rozwijam.<br><em>Praktyka, którą pokazuję.</em></h1><nav class="header-actions" aria-label="Nawigacja główna"><button type="button" class="button primary" data-open-cv aria-haspopup="dialog" aria-controls="cv-dialog">Wybierz CV <span aria-hidden="true">⌄</span></button><a class="header-contact" href="#kontakt">Kontakt ${arrow}</a></nav><p class="header-intro">${esc(profile.intro)}</p></header>
<main>
<section class="portfolio-section" id="portfolio" aria-labelledby="portfolio-title"><h2 id="portfolio-title" class="sr-only">Projekty</h2>
<div class="track-nav" role="tablist" aria-label="Kierunki portfolio">${profile.tracks.map(t=>`<button type="button" role="tab" id="tab-${t.id}" aria-controls="${t.id}" aria-selected="${t.id==='ai'}" tabindex="${t.id==='ai'?0:-1}" data-track="${t.id}"><span>${t.number}</span>${esc(t.label)}<span class="tab-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
${profile.tracks.map(t=>`<section class="track-panel" id="${t.id}" role="tabpanel" aria-labelledby="tab-${t.id}" tabindex="0"><div class="project-list">${t.order.map((id,i)=>card(projects.find(p=>p.id===id),t.id,i)).join('')}</div></section>`).join('')}
</section>
<section class="contact-section" id="kontakt" aria-labelledby="contact-title"><p class="eyebrow">Kontakt i CV</p><div class="contact-grid"><div><h2 id="contact-title">Porozmawiajmy<br>o konkretnej pracy.</h2><p>Szukam możliwości rozwoju zawodowego w IT.<br>Chętnie opowiem o projektach i mojej roli w ich powstawaniu.</p><a class="contact-email" href="mailto:${esc(profile.email)}">${esc(profile.email)} ${arrow}</a><div class="social-links">${external({label:'LinkedIn',url:profile.linkedin})}${external({label:'GitHub',url:profile.github})}</div></div>${contactCvs}</div></section>
</main><footer><span>© ${profile.updated.slice(0,4)} ${esc(profile.name)}</span><span>Aktualizacja treści: ${profile.updated.split('-').reverse().join('.')}</span><a href="#">Wróć na górę ↑</a></footer>
<dialog id="cv-dialog" aria-labelledby="cv-dialog-title" aria-describedby="cv-dialog-description"><div class="cv-dialog-heading"><h2 id="cv-dialog-title">Wybierz CV</h2><button type="button" class="cv-close" aria-label="Zamknij wybór CV" autofocus>Zamknij <span aria-hidden="true">×</span></button></div><p id="cv-dialog-description">Wybierz kierunek. Podgląd PDF otworzy się w nowej karcie.</p><ul class="cv-options">${profile.cvs.map(cv=>`<li><div><h3>${esc(cv.label)}</h3><p>${esc(cv.description)}</p></div><div class="cv-option-actions"><a class="cv-view" href="${esc(cv.url)}" target="_blank" rel="noopener noreferrer" aria-label="Zobacz CV: ${esc(cv.label)} (PDF, nowa karta)">Zobacz ${arrow}</a><a class="cv-save" href="${esc(cv.url)}" download aria-label="Pobierz CV: ${esc(cv.label)} (PDF)">Pobierz <span aria-hidden="true">↓</span></a></div></li>`).join('')}</ul></dialog>
<dialog id="image-dialog" aria-labelledby="image-project"><header class="image-dialog-header"><h2 id="image-project" class="sr-only"></h2><nav id="image-navigation" aria-label="Przeglądaj zrzuty ekranu"><button type="button" id="image-previous" aria-label="Poprzedni ekran">←</button><span id="image-count" aria-live="polite"></span><button type="button" id="image-next" aria-label="Następny ekran">→</button></nav><button type="button" id="close-dialog" aria-label="Zamknij powiększony obraz" autofocus>Zamknij ×</button></header><div id="image-stage"><img id="dialog-image" alt="Powiększony zrzut ekranu projektu"></div></dialog>
</body></html>`;
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(resolve(root,'public'), out, { recursive:true });
await cp(resolve(root,'src/styles.css'), resolve(out,'styles.css'));
await cp(resolve(root,'src/app.js'), resolve(out,'app.js'));
await writeFile(resolve(out,'index.html'), html.replaceAll('<span aria-hidden="true">↘</span>', arrow.replace('arrow-icon','arrow-icon arrow-down')).replaceAll('<span class="tab-arrow" aria-hidden="true">↗</span>', arrow.replace('arrow-icon','arrow-icon tab-arrow')));
await writeFile(resolve(out,'404.html'), '<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nie znaleziono strony</title><body style="font:18px system-ui;max-width:600px;margin:15vh auto;padding:24px"><h1>Nie znaleziono strony</h1><p><a href="/">Wróć do portfolio Denysa Nevskyi</a></p></body></html>');
console.log(`Built ${projects.length} projects across ${profile.tracks.length} perspectives in dist/`);
