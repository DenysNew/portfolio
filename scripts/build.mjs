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
    const image = p.images[0];
    return `<figure class="project-image"><button class="image-open" type="button" data-image="${esc(image.src)}" data-caption="${esc(image.caption)}" aria-label="Powiększ: ${esc(image.alt)}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy" width="1200" height="750"><span>Powiększ ${arrow}</span></button><figcaption>${esc(image.caption)}</figcaption></figure>`;
  }
  const process = p.process;
  if (!process?.steps?.length) throw new Error(`Missing process example: ${p.id}`);
  return `<figure class="project-visual visual-${esc(p.visual)}"><figcaption class="process-heading"><span class="visual-mark">${esc(process.label)}</span><strong>${esc(process.title)}</strong></figcaption><ol class="process-steps">${process.steps.map((step,i)=>`<li><span class="process-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><h4>${esc(step.title)}</h4><p>${esc(step.text)}</p></div></li>`).join('')}</ol><p class="process-note">${esc(process.note)}</p></figure>`;
}
function card(p, track, index) {
  return `<article class="project" id="${track}-${p.id}">
    <div class="project-heading"><span class="project-number">${String(index+1).padStart(2,'0')}</span><span class="status ${esc(p.statusType)}"><i aria-hidden="true"></i>${esc(p.status)}</span></div>
    <div class="project-layout"><div class="project-copy"><p class="project-subtitle">${esc(p.subtitle)}</p><h3>${esc(p.name)}</h3><p class="summary">${esc(p.summary)}</p>
    <p class="label">Moja rola</p><ul class="role-list">${p.roles.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>
    <ul class="tags" aria-label="Narzędzia i technologie">${p.stack.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
    ${p.links.length?`<div class="project-links">${p.links.map(external).join('')}</div>`:''}</div>${visual(p)}</div>
    <details class="project-details"><summary><span>Proces i szczegóły techniczne</span><span class="details-symbol" aria-hidden="true">+</span></summary><div class="details-grid">${p.details.map(d=>`<section><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p></section>`).join('')}</div>${p.images.length>1?`<div class="gallery">${p.images.slice(1).map(img=>`<button type="button" class="image-open" data-image="${esc(img.src)}" data-caption="${esc(img.caption)}" aria-label="Powiększ: ${esc(img.alt)}"><img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy"></button>`).join('')}</div>`:''}</details>
  </article>`;
}
const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Portfolio Denysa Nevskyi. Własne projekty AI i automatyzacji, praktyka administracji IT oraz laboratoria cyberbezpieczeństwa."><meta name="theme-color" content="#173b32"><meta name="color-scheme" content="light"><title>${esc(profile.name)} — ${esc(profile.title)}</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head>
<body><a class="skip-link" href="#portfolio">Przejdź do projektów</a>
<header class="site-header"><a href="#" class="brand" aria-label="Denys Nevskyi — początek strony"><span class="monogram" aria-hidden="true">DN<span>.</span></span><span class="brand-name">Denys Nevskyi<small>Portfolio projektów IT</small></span></a><nav aria-label="Nawigacja główna"><a href="#portfolio">Projekty</a><a href="#jak-pracuje">Jak pracuję</a><a href="#kontakt">Kontakt ${arrow}</a></nav></header>
<main>
<section class="hero" aria-labelledby="hero-title"><div class="hero-main"><p class="eyebrow"><span class="little-dot" aria-hidden="true"></span>${esc(profile.location)}</p><h1 id="hero-title">Projekty, które rozwijam.<br><em>Praktyka, którą pokazuję.</em></h1></div><div class="hero-description"><p class="hero-intro">${esc(profile.intro)}</p><div class="hero-actions"><a class="button primary" href="#portfolio">Zobacz projekty <span aria-hidden="true">↓</span></a><a class="button secondary" href="${esc(profile.cv.url)}" download>Pobierz CV <span aria-hidden="true">↘</span></a></div></div></section>
<section class="portfolio-section" id="portfolio" aria-labelledby="portfolio-title"><h2 id="portfolio-title" class="sr-only">Projekty</h2>
<div class="track-nav" role="tablist" aria-label="Kierunki portfolio">${profile.tracks.map(t=>`<button type="button" role="tab" id="tab-${t.id}" aria-controls="${t.id}" aria-selected="${t.id==='ai'}" tabindex="${t.id==='ai'?0:-1}" data-track="${t.id}"><span>${t.number}</span>${esc(t.label)}<span class="tab-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
${profile.tracks.map(t=>`<section class="track-panel" id="${t.id}" role="tabpanel" aria-labelledby="tab-${t.id}" tabindex="0"><p class="track-context">${esc(t.context)}</p><div class="project-list">${t.order.map((id,i)=>card(projects.find(p=>p.id===id),t.id,i)).join('')}</div></section>`).join('')}
</section>
<section class="working-section" id="jak-pracuje" aria-labelledby="working-title"><div class="working-intro"><p class="eyebrow">Jak pracuję</p><h2 id="working-title">Kontekst, działanie<br>i sprawdzenie wyniku.</h2><p>Korzystam z AI w codziennej pracy. Określam cel, organizuję zadania i weryfikuję to, co powstaje.</p></div><div class="working-steps"><div><span>01</span><h3>Ustalam potrzebę</h3><p>Opisuję, co ma działać i po czym poznam, że zadanie jest wykonane.</p></div><div><span>02</span><h3>Prowadzę pracę</h3><p>Łączę narzędzia, dokumentację i agentów. Zachowuję kontekst między etapami.</p></div><div><span>03</span><h3>Sprawdzam rezultat</h3><p>Testuję scenariusze, analizuję błędy i podejmuję decyzję o dalszych zmianach.</p></div></div></section>
<section class="contact-section" id="kontakt" aria-labelledby="contact-title"><p class="eyebrow">Kontakt i CV</p><div class="contact-grid"><div><h2 id="contact-title">Porozmawiajmy<br>o konkretnej pracy.</h2><p>Szukam możliwości rozwoju zawodowego w IT.<br>Chętnie opowiem o projektach i mojej roli w ich powstawaniu.</p><a class="contact-email" href="mailto:${esc(profile.email)}">${esc(profile.email)} ${arrow}</a><div class="social-links">${external({label:'LinkedIn',url:profile.linkedin})}${external({label:'GitHub',url:profile.github})}</div></div><div class="cv-card"><span class="document-icon" aria-hidden="true">CV<span>PDF</span></span><h3>AI i automatyzacja</h3><p>Krótki profil i wybrane doświadczenia projektowe.</p><a class="button primary" href="${esc(profile.cv.url)}" download>Pobierz CV <span aria-hidden="true">↘</span></a><p class="language-note">${esc(profile.languages)}</p></div></div></section>
</main><footer><span>© ${profile.updated.slice(0,4)} ${esc(profile.name)}</span><span>Aktualizacja treści: ${profile.updated.split('-').reverse().join('.')}</span><a href="#">Wróć na górę ↑</a></footer>
<dialog id="image-dialog" aria-labelledby="image-caption"><button type="button" id="close-dialog" aria-label="Zamknij powiększony obraz">Zamknij ×</button><img id="dialog-image" alt="Powiększony zrzut ekranu projektu"><p id="image-caption"></p></dialog>
</body></html>`;
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(resolve(root,'public'), out, { recursive:true });
await cp(resolve(root,'src/styles.css'), resolve(out,'styles.css'));
await cp(resolve(root,'src/app.js'), resolve(out,'app.js'));
await writeFile(resolve(out,'index.html'), html.replaceAll('<span aria-hidden="true">↘</span>', arrow.replace('arrow-icon','arrow-icon arrow-down')).replaceAll('<span class="tab-arrow" aria-hidden="true">↗</span>', arrow.replace('arrow-icon','arrow-icon tab-arrow')));
await writeFile(resolve(out,'404.html'), '<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nie znaleziono strony</title><body style="font:18px system-ui;max-width:600px;margin:15vh auto;padding:24px"><h1>Nie znaleziono strony</h1><p><a href="/">Wróć do portfolio Denysa Nevskyi</a></p></body></html>');
console.log(`Built ${projects.length} projects across ${profile.tracks.length} perspectives in dist/`);
