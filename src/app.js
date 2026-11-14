const tabs = [...document.querySelectorAll('[data-track]')];
const panels = [...document.querySelectorAll('.track-panel')];
const contactCvs = [...document.querySelectorAll('[data-track-cv]')];
const ids = tabs.map(tab => tab.dataset.track);
function activate(id, updateHash = false, focus = false) {
  if (!ids.includes(id)) return;
  for (const tab of tabs) {
    const selected = tab.dataset.track === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  }
  for (const panel of panels) panel.hidden = panel.id !== id;
  for (const cv of contactCvs) cv.hidden = cv.dataset.trackCv !== id;
  if (updateHash) history.replaceState(null, '', `#${id}`);
}
activate(ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'ai');
for (const tab of tabs) {
  tab.addEventListener('click', () => activate(tab.dataset.track, true));
  tab.addEventListener('keydown', event => {
    const current = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (current + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activate(ids[next], true, true); }
  });
}
document.querySelectorAll('[data-select]').forEach(link => link.addEventListener('click', () => activate(link.dataset.select)));
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (ids.includes(id)) activate(id);
});
const dialog = document.getElementById('image-dialog');
const dialogImage = document.getElementById('dialog-image');
const imageNavigation = document.getElementById('image-navigation');
let imageOpener;
let galleryImages = [];
let imageIndex = 0;
function showImage(index) {
  imageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[imageIndex];
  dialogImage.src = image.src;
  dialogImage.alt = image.alt;
  document.getElementById('image-count').textContent = `${imageIndex + 1} / ${galleryImages.length}`;
  imageNavigation.hidden = galleryImages.length < 2;

}
document.querySelectorAll('.photo-stack').forEach(button => button.addEventListener('click', () => {
  imageOpener = button;
  galleryImages = JSON.parse(button.dataset.gallery);
  document.getElementById('image-project').textContent = `Zrzuty ekranu — ${button.closest('.project').querySelector('h3').textContent}`;
  showImage(0);
  dialog.showModal();
  document.documentElement.classList.add('image-viewer-open');
}));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
document.getElementById('image-previous').addEventListener('click', () => showImage(imageIndex - 1));
document.getElementById('image-next').addEventListener('click', () => showImage(imageIndex + 1));
dialog.addEventListener('keydown', event => {
  if (galleryImages.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  showImage(imageIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.documentElement.classList.remove('image-viewer-open');
  imageOpener?.focus({ preventScroll: true });
});

const cvDialog = document.getElementById('cv-dialog');
let cvOpener;
document.querySelectorAll('[data-open-cv]').forEach(button => button.addEventListener('click', () => {
  cvOpener = button;
  cvDialog.showModal();
}));
cvDialog.querySelector('.cv-close').addEventListener('click', () => cvDialog.close());
cvDialog.addEventListener('click', event => {
  if (event.target !== cvDialog) return;
  const bounds = cvDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) cvDialog.close();
});
cvDialog.addEventListener('close', () => cvOpener?.focus({ preventScroll: true }));
