'use strict';

const animBg = document.querySelector('#logo-anim-bg');
const animElement = document.querySelector('#logo-anim');

const anim = lottie.loadAnimation({
  container: animElement,
  loop: false,
  autoplay: true,
  path: 'assets/logo-anim.json', // the path to the animation json
});

anim.onComplete = () => animBg.classList.add('anim--hidden');
