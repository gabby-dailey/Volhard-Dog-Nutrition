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
