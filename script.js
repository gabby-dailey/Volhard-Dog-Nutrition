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

// Scroll reveal (fade-in, fires once). Stats count up once here too;
// the ongoing "loop" is a pure-CSS heartbeat animation, not a repeat.
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      const counts = entry.target.querySelectorAll('.count');
      counts.forEach((c, i) => animateCount(c, i * 260));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

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

// Click-to-play video cards, with sound (self-hosted <video>, no external
// embeds). Browsers block unmuted autoplay on hover/mouseenter, since that
// isn't treated as a real user gesture, so these play on click instead.
const allCardVideos = [];
document.querySelectorAll('.video-frame[data-video-src]').forEach((frame) => {
  const video = frame.querySelector('.video-el');
  if (!video) return;
  video.muted = false;
  allCardVideos.push(video);

  frame.addEventListener('click', () => {
    const isPlaying = !video.paused;
    allCardVideos.forEach((v) => {
      if (v !== video) { v.pause(); v.currentTime = 0; }
    });
    document.querySelectorAll('.video-frame.is-playing').forEach((f) => f.classList.remove('is-playing'));

    if (isPlaying) {
      video.pause();
      video.currentTime = 0;
      frame.classList.remove('is-playing');
    } else {
      if (video.readyState < 1) video.load();
      video.play().catch(() => {});
      frame.classList.add('is-playing');
    }
  });
});
