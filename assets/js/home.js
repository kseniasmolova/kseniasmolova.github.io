'use strict';

const debounce = (fn, wait = 0) => {
  let timeout;

  return function (...args) {
    const later = () => {
      timeout = null;
      fn.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Manually calculate mobile viewport size, see:
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
const updateWindowHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
updateWindowHeight();
// window.addEventListener('resize', debounce(updateWindowHeight, 500));

const animBg = document.querySelector('#logo-anim-bg');
const animElement = document.querySelector('#logo-anim');

const anim = lottie.loadAnimation({
  container: animElement,
  loop: false,
  autoplay: true,
  path: 'assets/logo-anim.json',
});

anim.onComplete = () => {
  animBg.classList.add('anim--hidden');
  document.querySelector('video').play();
};

/**
 *
 *
 *
 *
 *
 */

class FluentButton {
  constructor(el, { clickable = false } = {}) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (FluentButton.elements.has(this.el)) return;
    FluentButton.elements.add(this.el);

    if (clickable) this.el.classList.add('clickable');
    if (clickable) this.el.addEventListener('touchstart', this.startRipple);
    if (clickable) this.el.addEventListener('mousedown', this.startRipple);
    if (clickable) this.el.onmousedown = this.el.ontouchstart = this.addPressedState;
    this.el.onmouseup = this.el.onmouseleave = this.el.ontouchend = this.removePressedState;

    FluentButton.outerRevealElements.set(this.el, this.getElementDimensions(this.el));
    if (!FluentButton.observingOuterReveal) this.observeOuterReveal();
  }

  updateCoordinates({ pageX, pageY, currentTarget }) {
    const x = pageX - currentTarget.offsetLeft;
    const y = pageY - currentTarget.offsetTop;

    currentTarget.style.setProperty('--x', `${x}px`);
    currentTarget.style.setProperty('--y', `${y}px`);

    return { x, y };
  }

  startRipple({ currentTarget }) {
    currentTarget.classList.remove('fluent-btn--ripple'); // remove prev
    // Add again to (re)start animation
    setTimeout(() => currentTarget.classList.add('fluent-btn--ripple'), 25);
  }
  addPressedState({ currentTarget }) {
    currentTarget.classList.add('fluent-btn--pressed');
  }
  removePressedState({ currentTarget }) {
    currentTarget.classList.remove('fluent-btn--pressed');
  }

  observeOuterReveal() {
    FluentButton.observingOuterReveal = true;

    window.addEventListener('resize', this.updateElementDimensions.bind(this));
    window.addEventListener('mousemove', (event) => {
      window.requestAnimationFrame(this.updateOuterReveal.bind(this, event));
    });
    window.addEventListener('touchmove', ({ touches }) => {
      const [{ clientX, clientY }] = touches;
      const position = { pageX: clientX, pageY: clientY };
      window.requestAnimationFrame(this.updateOuterReveal.bind(this, position));
    });
  }

  updateOuterReveal({ pageX, pageY }) {
    for (const [el, { width, height }] of FluentButton.outerRevealElements) {
      const { x, y } = this.updateCoordinates({ pageX, pageY, currentTarget: el });

      if (this.isInRevealThreshold({ x, y, width, height })) {
        el.classList.add('fluent-btn--reveal');
      } else {
        el.classList.remove('fluent-btn--reveal');
      }
    }
  }

  isInRevealThreshold({ x, y, width, height }) {
    const threshold = FluentButton.outerRevealThreshold;
    return x > -threshold && x < width + threshold && y > -threshold && y < height + threshold;
  }

  getElementDimensions(el) {
    const { width, height } = el.getBoundingClientRect();
    return { width, height };
  }
  updateElementDimensions() {
    for (const [el] of FluentButton.outerRevealElements) {
      FluentButton.outerRevealElements.set(el, this.getElementDimensions(el));
    }
  }
}

FluentButton.elements = new Set();
FluentButton.outerRevealElements = new Map();
FluentButton.outerRevealThreshold = 75;
FluentButton.observingOuterReveal = false;

new FluentButton('#showreel_btn', { clickable: true });
new FluentButton('#mail');

const stickyDetect = document.querySelector('#sticky');
const header = document.querySelector('#header');

new IntersectionObserver(
  (entries) => {
    if (entries[0].intersectionRatio === 0) header.classList.add('bg-premiere-light', 'md:bg-premiere-light');
    else if (entries[0].intersectionRatio === 1) header.classList.remove('bg-premiere-light', 'md:bg-premiere-light');
  },
  { threshold: [0, 1], rootMargin: '100% 0px 0px 0px' },
).observe(stickyDetect);
