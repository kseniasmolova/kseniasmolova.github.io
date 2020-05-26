'use strict';

const debounce = function (fn, wait) {
  let timeout;

  return function () {
    const _this = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      fn.apply(_this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 0);
  };
};

// Manually calculate mobile viewport size, see:
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
const updateHeight = function () {
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
};

updateHeight();
if (!/iOS/.test(navigator.userAgent)) {
  window.addEventListener('resize', debounce(updateHeight, 350));
}

const animBg = document.querySelector('#logo-anim-bg');
const animElement = document.querySelector('#logo-anim');

const anim = lottie.loadAnimation({
  container: animElement,
  loop: false,
  autoplay: true,
  path: 'assets/logo-anim.json',
});

anim.onComplete = function () {
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
let supportsClass = true;
try {
  eval('"use strict"; class Foo {}');
} catch (_) {
  supportsClass = false;
}

if (supportsClass) insert('./assets/js/fluent-button.js');

const stickyDetect = document.querySelector('#sticky');
const header = document.querySelector('#header');

new IntersectionObserver(
  function (entries) {
    if (entries[0].intersectionRatio === 0) header.classList.add('bg-premiere-light', 'md:bg-premiere-light');
    else if (entries[0].intersectionRatio === 1) header.classList.remove('bg-premiere-light', 'md:bg-premiere-light');
  },
  { threshold: [0, 1], rootMargin: '100% 0px 0px 0px' }
).observe(stickyDetect);
