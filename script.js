const currentPage = document.body.dataset.page || 'home';
const sharedHeader = document.querySelector('[data-header]');
const sharedFooter = document.querySelector('[data-footer]');

if (sharedHeader) {
  const navItems = [
    ['home', 'index.html', 'Cover'], ['about', 'about.html', 'About'],
    ['experience', 'experience.html', 'Experience'], ['services', 'services.html', 'Services'],
    ['demos', 'demos.html', 'Demos'], ['contact', 'contact.html', "Let's connect"]
  ];
  sharedHeader.innerHTML = `<header class="site-header scrolled">
    <a class="brand page-link" href="index.html" aria-label="Zannie K. home"><span class="brand-mark">ZK</span><span>Zannie K.</span></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span><span class="sr-only">Open menu</span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">${navItems.map(([id, href, label]) => `<a class="page-link ${id === currentPage ? 'active' : ''} ${id === 'contact' ? 'nav-cta' : ''}" href="${href}" ${id === currentPage ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
  </header>`;
}

if (sharedFooter) {
  const contacts = `<a href="mailto:Zanniemadman@gmail.com"><span>✉</span> Zanniemadman@gmail.com</a><a href="tel:+17733169585"><span>☎</span> (773) 316-9585</a><a href="https://www.zanniek.com" target="_blank" rel="noopener"><span>◎</span> zanniek.com</a><a href="https://www.instagram.com/Zanniek" target="_blank" rel="noopener"><span>◉</span> @Zanniek</a><a href="https://www.linkedin.com/in/Zanie.glover" target="_blank" rel="noopener"><span>in</span> linkedin.com/in/Zanie.glover</a>`;
  sharedFooter.innerHTML = `<div class="contact-ticker" aria-label="Zannie K. contact information"><div class="ticker-track"><div class="ticker-group">${contacts}</div><div class="ticker-group" aria-hidden="true">${contacts}</div></div></div><footer class="site-footer"><p>© <span id="year"></span> Zannie K. All rights reserved.</p><a class="page-link" href="index.html">Back to cover ↑</a></footer>`;
  sharedFooter.querySelectorAll('.ticker-group[aria-hidden] a').forEach((link) => link.tabIndex = -1);
}

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const willOpen = !nav.classList.contains('open');
  nav.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 32 || currentPage !== 'home'));
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

requestAnimationFrame(() => document.body.classList.add('page-ready'));
document.querySelectorAll('a.page-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || link.target === '_blank') return;
    const destination = link.getAttribute('href');
    if (!destination || destination.startsWith('#')) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = destination; }, 220);
  });
});

const revealGroups = [
  ['.section-heading, .about-copy, .about-photo', ['from-left', '', 'from-right']],
  ['.experience-photo, .experience-content', ['from-left', 'from-right']],
  ['.center-heading, .service-card', ['', '', '', '']],
  ['.demo-intro, .demo-player', ['from-left', 'from-right', 'from-right', 'from-right']],
  ['.modern-copy, .modern-photo', ['from-left', 'from-right']],
  ['.contact-section > *', ['from-left', 'from-right']]
];

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' })
  : null;

revealGroups.forEach(([selector, directions]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add('reveal');
    const direction = directions[index] || '';
    if (direction) element.classList.add(direction);
    element.style.setProperty('--reveal-delay', `${Math.min(index * 90, 270)}ms`);
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('is-visible');
  });
});

document.querySelectorAll('.reveal-on-scroll').forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 90, 270)}ms`);
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

const statObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate(
          [{ transform: 'scale(.92)', opacity: .45 }, { transform: 'scale(1)', opacity: 1 }],
          { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: .45 })
  : null;

if (statObserver) document.querySelectorAll('.stat-grid article').forEach((stat) => statObserver.observe(stat));

let activeAudio = null;

document.querySelectorAll('.demo-player').forEach((player) => {
  const source = player.dataset.src;
  const button = player.querySelector('.track-button');
  const status = player.querySelector('.track-status');
  const audio = new Audio(source);
  audio.preload = 'metadata';

  const markReady = () => {
    button.disabled = false;
    player.classList.add('ready');
    status.textContent = 'Ready to play';
  };

  audio.addEventListener('loadedmetadata', markReady, { once: true });
  audio.addEventListener('ended', () => {
    button.textContent = '▶';
    button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Pause', 'Play'));
    status.textContent = 'Play again';
    player.classList.remove('playing');
    activeAudio = null;
  });

  button.addEventListener('click', () => {
    if (activeAudio && activeAudio !== audio) {
      activeAudio.pause();
      document.querySelectorAll('.demo-player.playing').forEach((otherPlayer) => otherPlayer.classList.remove('playing'));
      document.querySelectorAll('.track-button').forEach((other) => {
        if (other !== button && !other.disabled) other.textContent = '▶';
      });
    }

    if (audio.paused) {
      audio.play();
      activeAudio = audio;
      button.textContent = 'Ⅱ';
      button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Play', 'Pause'));
      status.textContent = 'Playing';
      player.classList.add('playing');
    } else {
      audio.pause();
      activeAudio = null;
      button.textContent = '▶';
      button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Pause', 'Play'));
      status.textContent = 'Paused';
      player.classList.remove('playing');
    }
  });
});
