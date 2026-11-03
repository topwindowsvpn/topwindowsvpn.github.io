// Rating filter — hide/show existing HTML cards by data-tags attribute
function applyFilter(activeTag) {
  const grid = document.getElementById('ratingGrid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.vcard');
  const pinnedLabel = grid.querySelector('[data-block="pinned"]');
  const restLabel = grid.querySelector('[data-block="rest"]');
  const pinnedCol = grid.querySelector('[data-col="pinned"]');
  const restCol = grid.querySelector('[data-col="rest"]');
  const empty = grid.querySelector('#emptyFilter');

  let pinnedShown = 0;
  let restShown = 0;

  cards.forEach(card => {
    let tags = [];
    try { tags = JSON.parse(card.dataset.tags || '[]'); } catch(e) { tags = []; }
    const match = activeTag === 'all' || tags.includes(activeTag);
    card.style.display = match ? '' : 'none';
    if (match) {
      if (card.dataset.pinned === 'true') pinnedShown++;
      else restShown++;
    }
  });

  if (pinnedLabel) pinnedLabel.style.display = pinnedShown > 0 ? '' : 'none';
  if (pinnedCol) pinnedCol.style.display = pinnedShown > 0 ? '' : 'none';
  if (restLabel) restLabel.style.display = restShown > 0 ? '' : 'none';
  if (restCol) restCol.style.display = restShown > 0 ? '' : 'none';
  if (empty) empty.style.display = (pinnedShown + restShown) === 0 ? 'block' : 'none';
}

const filterTags = document.getElementById('filterTags');
if (filterTags) {
  filterTags.addEventListener('click', function(e) {
    const btn = e.target.closest('.ftag');
    if (!btn) return;
    filterTags.querySelectorAll('.ftag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.tag);
  });
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Install tabs
const installTabs = document.getElementById('installTabs');
if (installTabs) {
  installTabs.addEventListener('click', function(e) {
    const btn = e.target.closest('.itab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    installTabs.querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.itab-body').forEach(body => {
      body.classList.toggle('active', body.dataset.tabBody === tab);
    });
  });
}

// Mobile menu
const burger = document.getElementById('headerBurger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('open');
  if (burger) burger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

if (burger && mobileMenu) {
  burger.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    if (mobileOverlay) mobileOverlay.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('.mlink').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Active section highlight in top nav
const navSections = ['rating','versions','install','table','faq']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll('.nav-link');
if (navSections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
  navSections.forEach(el => sectionObserver.observe(el));
}
