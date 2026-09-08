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

muteToggle.addEventListener('click', () => {
  heroVideo.muted = !heroVideo.muted;
  muteToggle.textContent = heroVideo.muted ? 'UNMUTE' : 'MUTE';
});

// Animated count-up on the big proof stats
function animateCount(el, delay = 0) {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1400;
  setTimeout(() => {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, delay);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counts = entry.target.querySelectorAll('.count');
      counts.forEach((c, i) => animateCount(c, i * 260));
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.big-stat').forEach((el) => countObserver.observe(el));

// Hover-to-play video cards (self-hosted <video>, no external embeds)
document.querySelectorAll('.video-frame[data-video-src]').forEach((frame) => {
  const video = frame.querySelector('.video-el');
  if (!video) return;

  function play() {
    if (video.readyState < 1) video.load();
    video.play().catch(() => {});
  }

  function pause() {
    video.pause();
    video.currentTime = 0;
  }

  frame.addEventListener('mouseenter', play);
  frame.addEventListener('mouseleave', pause);
  frame.addEventListener('touchstart', play, { passive: true });
});
