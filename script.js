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

// Scroll reveal (fade-in, fires once)
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

// Stat count-up: loops continuously while the block is on screen, not a
// one-shot animation that only plays on the initial scroll past it
const statLoops = new WeakMap();

function runCountCycle(container) {
  const counts = container.querySelectorAll('.count');
  counts.forEach((c, i) => setTimeout(() => animateCount(c), i * 260));
}

const statLoopObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (!statLoops.has(entry.target)) {
        runCountCycle(entry.target);
        const id = setInterval(() => runCountCycle(entry.target), 5000);
        statLoops.set(entry.target, id);
      }
    } else if (statLoops.has(entry.target)) {
      clearInterval(statLoops.get(entry.target));
      statLoops.delete(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.big-stat').forEach((el) => statLoopObserver.observe(el));

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
