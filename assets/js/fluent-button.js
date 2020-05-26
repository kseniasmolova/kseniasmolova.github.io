class FluentButton {
  constructor(el, { ripple = false } = {}) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (FluentButton.elements.has(this.el)) return;
    FluentButton.elements.add(this.el);

    if (ripple) this.el.classList.add('ripple');
    if (ripple) this.el.addEventListener('touchstart', this.startRipple);
    if (ripple) this.el.addEventListener('mousedown', this.startRipple);
    if (ripple) this.el.onmousedown = this.el.ontouchstart = this.addPressedState;
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

new FluentButton('#showreel_btn', { ripple: true });
new FluentButton('#mail');
