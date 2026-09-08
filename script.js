// Nav background + scroll progress
const siteNav = document.getElementById('siteNav');
const progressBar = document.getElementById('progressBar');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  siteNav.classList.toggle('scrolled', scrollTop > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

// Hero mute/unmute toggle
const heroVideo = document.getElementById('heroVideo');
const muteToggle = document.getElementById('muteToggle');
let heroMuted = true;

function postToHero(func) {
  heroVideo.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
}

muteToggle.addEventListener('click', () => {
  heroMuted = !heroMuted;
  postToHero(heroMuted ? 'mute' : 'unMute');
  muteToggle.textContent = heroMuted ? 'UNMUTE' : 'MUTE';
});

// Hover-to-play video cards (proof + direction cards)
function buildEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;
}

document.querySelectorAll('[data-video-id]').forEach((card) => {
  const videoId = card.getAttribute('data-video-id');
  const frame = card.querySelector('.video-frame');
  const embedSlot = card.querySelector('.video-embed');
  let iframeEl = null;
  let leaveTimer = null;

  function ensureIframe() {
    if (iframeEl) return iframeEl;
    iframeEl = document.createElement('iframe');
    iframeEl.src = buildEmbedUrl(videoId);
    iframeEl.title = 'video preview';
    iframeEl.frameBorder = '0';
    iframeEl.allow = 'autoplay; encrypted-media';
    iframeEl.tabIndex = -1;
    embedSlot.appendChild(iframeEl);
    return iframeEl;
  }

  function play() {
    clearTimeout(leaveTimer);
    ensureIframe();
  }

  function pause() {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      if (iframeEl) {
        embedSlot.innerHTML = '';
        iframeEl = null;
      }
    }, 150);
  }

  frame.addEventListener('mouseenter', play);
  frame.addEventListener('mouseleave', pause);
  frame.addEventListener('touchstart', play, { passive: true });
});
