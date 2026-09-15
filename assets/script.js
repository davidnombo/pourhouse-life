(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.dot')];
  const pauseButton = document.querySelector('.pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;
  let paused = reducedMotion;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    if (!paused) timer = window.setInterval(() => showSlide(current + 1), 4500);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startTimer();
    });
  });

  pauseButton?.addEventListener('click', () => {
    paused = !paused;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play background slideshow' : 'Pause background slideshow');
    startTimer();
  });

  if (reducedMotion && pauseButton) {
    pauseButton.setAttribute('aria-pressed', 'true');
    pauseButton.setAttribute('aria-label', 'Play background slideshow');
  }

  const countdown = document.querySelector('.countdown');
  const countdownLabel = document.querySelector('.countdown-label');
  const countdownParts = {
    days: document.querySelector('[data-countdown="days"]'),
    hours: document.querySelector('[data-countdown="hours"]'),
    minutes: document.querySelector('[data-countdown="minutes"]'),
    seconds: document.querySelector('[data-countdown="seconds"]')
  };
  const launchTime = new Date('2026-10-18T08:00:00-04:00').getTime();

  function updateCountdown() {
    const remaining = Math.max(0, launchTime - Date.now());
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    countdownParts.days.textContent = String(days).padStart(2, '0');
    countdownParts.hours.textContent = String(hours).padStart(2, '0');
    countdownParts.minutes.textContent = String(minutes).padStart(2, '0');
    countdownParts.seconds.textContent = String(seconds).padStart(2, '0');

    if (remaining === 0 && countdown) {
      countdown.classList.add('is-complete');
      countdownLabel.textContent = 'Launch day is here';
    }
  }

  showSlide(0);
  startTimer();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
