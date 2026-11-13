const tabs = [...document.querySelectorAll('[data-track]')];
const panels = [...document.querySelectorAll('.track-panel')];
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
const caption = document.getElementById('image-caption');
document.querySelectorAll('.image-open').forEach(button => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.image;
  dialogImage.alt = button.querySelector('img').alt;
  caption.textContent = button.dataset.caption || dialogImage.alt;
  dialog.showModal();
}));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
