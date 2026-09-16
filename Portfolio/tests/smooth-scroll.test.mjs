import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { transform } from 'esbuild';

// Run with: node --test tests/smooth-scroll.test.mjs
// Exercises the real integration with controlled DOM/Lenis/GSAP collaborators.
// It does not measure rendering, scroll physics, touch input or frame rate.
const source = await readFile(new URL('../src/shared/scripts/smooth-scroll.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'cjs', target: 'es2022' });

function setup({ reduced = false, intro = false } = {}) {
  const trace = [];
  const tickers = new Set();
  const instances = [];
  const observers = [];
  const frames = [];

  class Events {
    listeners = new Map();
    addEventListener(type, callback, options = {}) {
      if (options.signal?.aborted) return;
      const entries = this.listeners.get(type) ?? [];
      const entry = { callback, options };
      entries.push(entry);
      this.listeners.set(type, entries);
      options.signal?.addEventListener('abort', () => this.removeEventListener(type, callback), { once: true });
    }
    removeEventListener(type, callback) {
      this.listeners.set(type, (this.listeners.get(type) ?? []).filter((entry) => entry.callback !== callback));
    }
    dispatchEvent(event) {
      event.target ??= this;
      for (const entry of [...(this.listeners.get(event.type) ?? [])]) {
        if (entry.options.once) this.removeEventListener(event.type, entry.callback);
        entry.callback.call(this, event);
        if (event.immediateStopped) break;
      }
      return !event.defaultPrevented;
    }
    listenerCount() {
      return [...this.listeners.values()].reduce((total, entries) => total + entries.length, 0);
    }
  }

  class MockEvent {
    constructor(type, options = {}) {
      Object.assign(this, { type, defaultPrevented: false, button: 0, ...options });
    }
    preventDefault() { this.defaultPrevented = true; }
    stopPropagation() { this.propagationStopped = true; }
    stopImmediatePropagation() { this.immediateStopped = this.propagationStopped = true; }
    composedPath() { return this.path ?? [this.target]; }
  }

  const document = new Events();
  class Element extends Events {
    constructor(id = '') {
      super();
      this.id = id;
      this.isConnected = true;
      this.nodeType = 1;
      this.attributes = new Map();
      this.style = {
        setProperty: (key, value) => this.attributes.set(`style:${key}`, value),
        removeProperty: (key) => this.attributes.delete(`style:${key}`),
        getPropertyValue: (key) => this.attributes.get(`style:${key}`) ?? '',
      };
      const classes = new Set();
      this.classList = {
        contains: (name) => classes.has(name),
        add: (name) => classes.add(name),
        remove: (name) => classes.delete(name),
      };
      this.computedStyle = { position: 'static', top: '0px' };
      this.height = 0;
    }
    hasAttribute(key) { return this.attributes.has(key); }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    setAttribute(key, value) { this.attributes.set(key, value); }
    removeAttribute(key) { this.attributes.delete(key); }
    closest() { return this instanceof Anchor ? this : this.parentElement?.closest() ?? null; }
    getBoundingClientRect() { return { height: this.height, top: 0 }; }
    focus(options) {
      if (document.activeElement !== this) document.activeElement?.dispatchEvent(new MockEvent('blur'));
      document.activeElement = this;
      trace.push({ type: 'focus', target: this, options });
    }
    scrollIntoView(options) { trace.push({ type: 'native-scroll', target: this, options }); }
    contains(node) { return node === this; }
  }
  class Anchor extends Element {
    constructor(href) {
      super();
      this.href = new URL(href, location.href).href;
      this.target = '';
    }
  }
  const root = new Element('root');
  const header = new Element('header');
  header.computedStyle = { position: 'sticky', top: '16px' };
  header.height = 60;
  if (intro) root.classList.add('intro-pending');
  const elements = new Map(['inicio', 'proyectos', 'sobre-mi', 'experiencia', 'contacto'].map((id) => [id, new Element(id)]));
  document.documentElement = root;
  document.body = new Element('body');
  document.activeElement = document.body;
  document.querySelector = (selector) => selector === '[data-header]' ? header : null;
  document.getElementById = (id) => elements.get(id) ?? null;
  const location = new URL('https://portfolio.test/');
  const history = {
    pushes: [],
    scrollRestoration: 'auto',
    pushState(state, title, url) {
      this.pushes.push({ state, title, url });
      location.href = new URL(url, location.href).href;
    },
  };
  const motion = new Events();
  motion.matches = reduced;
  const window = new Events();
  window.location = location;
  window.matchMedia = () => motion;
  const gsap = {
    registerPlugin() {},
    ticker: {
      add: (callback) => tickers.add(callback),
      remove: (callback) => tickers.delete(callback),
      lagSmoothing: (...args) => trace.push({ type: 'lag-smoothing', args }),
    },
  };
  let updates = 0;
  const ScrollTrigger = { update: () => updates++ };

  class Lenis extends Events {
    constructor(options) {
      super();
      this.options = options;
      this.isStopped = false;
      instances.push(this);
      // Match Lenis 1.3.26's window-level anchors handler, including its lack
      // of defaultPrevented/modifier/query checks: the integration owns those.
      this.onClick = (event) => {
        const url = event.composedPath()
          .filter((node) => node instanceof Anchor && node.href)
          .map((node) => new URL(node.href))
          .find((target) => target.host === location.host && target.pathname === location.pathname && target.hash);
        if (url) this.scrollTo(decodeURIComponent(url.hash), options.anchors);
      };
      if (options.anchors) window.addEventListener('click', this.onClick);
    }
    on(type, callback) { this.addEventListener(type, callback); }
    raf(time) { trace.push({ type: 'raf', instance: this, time }); }
    scrollTo(target, options = {}) {
      if (this.isStopped && !options.force) return;
      trace.push({ type: 'lenis-scroll', instance: this, target, options });
      this.pending = options;
      if (options.immediate) this.complete();
    }
    complete() {
      const pending = this.pending;
      this.pending = undefined;
      pending?.onComplete?.(this);
    }
    stop() { this.isStopped = true; this.pending = undefined; trace.push({ type: 'stop', instance: this }); }
    start() { this.isStopped = false; trace.push({ type: 'start', instance: this }); }
    destroy() {
      this.destroyed = true;
      this.pending = undefined;
      window.removeEventListener('click', this.onClick);
      trace.push({ type: 'destroy', instance: this });
    }
  }
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  const module = { exports: {} };
  const context = vm.createContext({
    module, exports: module.exports,
    require: (name) => {
      if (name === 'lenis') return Lenis;
      if (name === 'gsap') return { gsap };
      if (name === 'gsap/ScrollTrigger') return { ScrollTrigger };
      if (name === 'lenis/dist/lenis.css') return {};
      throw new Error(`Unexpected import: ${name}`);
    },
    window, document, location, history,
    Element, HTMLElement: Element, HTMLAnchorElement: Anchor, Node: Element,
    Event: MockEvent, AbortController, URL,
    ResizeObserver: Observer, MutationObserver: Observer,
    matchMedia: () => motion, getComputedStyle: (node) => node.computedStyle,
    requestAnimationFrame: (callback) => frames.push(callback),
    cancelAnimationFrame() {},
    setTimeout: (callback) => frames.push(callback), clearTimeout() {},
    console,
  });
  vm.runInContext(code, context, { filename: 'smooth-scroll.ts' });

  return {
    ...module.exports, document, window, root, header, elements, history, location,
    motion, tickers, instances, observers, trace,
    get current() { return instances.at(-1); },
    get updates() { return updates; },
    click(href, options = {}) {
      const link = new Anchor(href);
      if (options.linkTarget) link.target = options.linkTarget;
      if (options.download) link.setAttribute('download', '');
      const event = new MockEvent('click', { target: link, ...options });
      document.dispatchEvent(event);
      if (!event.propagationStopped) window.dispatchEvent(event);
      return event;
    },
    setMotion(matches) { motion.matches = matches; motion.dispatchEvent(new MockEvent('change')); },
    setIntro(blocked) {
      root.classList[blocked ? 'add' : 'remove']('intro-pending');
      observers.filter((observer) => observer.target === root && !observer.disconnected).forEach((observer) => observer.callback([]));
    },
    navigateHistory(hash, type = 'popstate') {
      location.hash = hash;
      window.dispatchEvent(new MockEvent(type));
      while (frames.length) frames.shift()(0);
    },
  };
}

test('initialization is idempotent and GSAP owns the only animation ticker', () => {
  const app = setup();
  app.initializeSmoothScroll();
  app.initializeSmoothScroll();
  assert.equal(app.instances.length, 1);
  assert.equal(app.tickers.size, 1);
  const { autoRaf, smoothWheel, lerp, syncTouch, allowNestedScroll, anchors } = app.current.options;
  assert.deepEqual({ autoRaf, smoothWheel, lerp, syncTouch, allowNestedScroll }, {
    autoRaf: false, smoothWheel: true, lerp: 0.1, syncTouch: false, allowNestedScroll: true,
  });
  assert.ok(anchors);
  [...app.tickers][0](1.25);
  assert.equal(app.trace.find((event) => event.type === 'raf').time, 1250);
  app.current.dispatchEvent({ type: 'scroll' });
  assert.equal(app.updates, 1);
  app.destroySmoothScroll();
});

test('anchors close the menu before scrolling and account for the current navbar size', () => {
  const app = setup();
  app.initializeSmoothScroll();
  assert.equal(app.root.style.getPropertyValue('--anchor-offset'), '92px');
  app.document.addEventListener('navigation:close-menu', () => {
    app.trace.push({ type: 'menu-closed' });
    app.header.height = 48;
  });
  const event = app.click('/#contacto');
  assert.equal(event.defaultPrevented, true);
  assert.equal(app.root.style.getPropertyValue('--anchor-offset'), '80px');
  assert.ok(app.trace.findIndex((item) => item.type === 'menu-closed') < app.trace.findIndex((item) => item.type === 'lenis-scroll'));
  assert.equal(app.history.pushes.length, 1);
  assert.equal(app.location.hash, '#contacto');
  app.current.complete();
  assert.equal(app.document.activeElement, app.elements.get('contacto'));
  assert.equal(app.document.activeElement.getAttribute('tabindex'), '-1');
  app.elements.get('inicio').focus({ preventScroll: true });
  assert.equal(app.elements.get('contacto').hasAttribute('tabindex'), false);
  app.header.computedStyle.position = 'static';
  app.window.dispatchEvent({ type: 'resize' });
  assert.equal(app.root.style.getPropertyValue('--anchor-offset'), '0px');
  app.destroySmoothScroll();
});

test('repeated clicks replace the destination and focus only the latest section', () => {
  const app = setup();
  app.initializeSmoothScroll();
  app.click('/#contacto');
  app.click('/#proyectos');
  app.click('/#proyectos');
  app.current.complete();
  assert.equal(app.history.pushes.length, 2);
  assert.equal(app.document.activeElement, app.elements.get('proyectos'));
  assert.equal(app.trace.filter((event) => event.type === 'focus' && event.target.id === 'contacto').length, 0);
  app.destroySmoothScroll();
});

test('completion does not steal focus if the user moves it during the animation', () => {
  const app = setup();
  app.initializeSmoothScroll();
  app.click('/#contacto');
  app.elements.get('experiencia').focus({ preventScroll: true });
  app.current.complete();
  assert.equal(app.document.activeElement, app.elements.get('experiencia'));
  app.destroySmoothScroll();
});

test('modified, cancelled, download, external and different-query links are left alone', () => {
  for (const [href, options] of [
    ['/#contacto', { ctrlKey: true }], ['/#contacto', { metaKey: true }],
    ['/#contacto', { shiftKey: true }], ['/#contacto', { altKey: true }],
    ['/#contacto', { button: 1 }], ['/#contacto', { linkTarget: '_blank' }],
    ['/#contacto', { download: true }], ['/#contacto', { defaultPrevented: true }],
    ['/?preview=1#contacto', {}], ['http://portfolio.test/#contacto', {}],
    ['https://elsewhere.test/#contacto', {}], ['/proyectos/tu-cancha/#contacto', {}],
    ['/#missing', {}], ['/#%invalid', {}],
  ]) {
    const app = setup();
    app.initializeSmoothScroll();
    const event = app.click(href, options);
    assert.equal(app.trace.filter((entry) => entry.type === 'lenis-scroll').length, 0, `${href} ${JSON.stringify(options)}`);
    assert.equal(app.history.pushes.length, 0);
    assert.equal(event.defaultPrevented, Boolean(options.defaultPrevented));
    app.destroySmoothScroll();
  }
});

test('reduced motion uses immediate native navigation with no Lenis or ticker', () => {
  const app = setup({ reduced: true });
  app.initializeSmoothScroll();
  assert.equal(app.instances.length, 0);
  assert.equal(app.tickers.size, 0);
  app.click('/#sobre-mi');
  const scroll = app.trace.find((entry) => entry.type === 'native-scroll');
  assert.equal(scroll.target, app.elements.get('sobre-mi'));
  assert.equal(scroll.options.behavior, 'instant');
  assert.equal(app.document.activeElement, app.elements.get('sobre-mi'));
  app.setMotion(false);
  assert.equal(app.instances.length, 1);
  assert.equal(app.tickers.size, 1);
  app.click('/#contacto');
  app.setMotion(true);
  assert.equal(app.current.destroyed, true);
  assert.equal(app.tickers.size, 0);
  assert.equal(app.trace.filter((entry) => entry.type === 'native-scroll').at(-1).target, app.elements.get('contacto'));
  app.destroySmoothScroll();
});

test('intro blocks Lenis and releases it once the overlay closes', () => {
  const app = setup({ intro: true });
  app.initializeSmoothScroll();
  assert.equal(app.current.isStopped, true);
  app.click('/#contacto');
  assert.equal(app.trace.filter((event) => event.type === 'lenis-scroll').length, 0);
  assert.equal(app.history.pushes.length, 0);
  app.setIntro(false);
  assert.equal(app.current.isStopped, false);
  app.click('/#contacto');
  assert.equal(app.trace.filter((event) => event.type === 'lenis-scroll').length, 1);
  app.setIntro(true);
  assert.equal(app.current.isStopped, true);
  app.setIntro(false);
  assert.equal(app.current.isStopped, false);
  app.destroySmoothScroll();
});

test('history navigation cancels inertia and restores a hash without adding entries', () => {
  const app = setup();
  app.initializeSmoothScroll();
  app.click('/#contacto');
  const pushes = app.history.pushes.length;
  app.navigateHistory('#proyectos');
  const scroll = app.trace.filter((entry) => entry.type === 'lenis-scroll').at(-1);
  assert.equal(typeof scroll.target === 'string' ? scroll.target : `#${scroll.target.id}`, '#proyectos');
  assert.equal(scroll.options.immediate, true);
  assert.equal(app.history.pushes.length, pushes);
  assert.ok(app.trace.some((entry) => entry.type === 'stop'));
  assert.equal(app.current.isStopped, false);
  app.navigateHistory('#sobre-mi', 'hashchange');
  const next = app.trace.filter((entry) => entry.type === 'lenis-scroll').at(-1);
  assert.equal(typeof next.target === 'string' ? next.target : `#${next.target.id}`, '#sobre-mi');
  const beforeNativeRestore = app.trace.filter((entry) => entry.type === 'lenis-scroll').length;
  app.navigateHistory('');
  assert.equal(app.trace.filter((entry) => entry.type === 'lenis-scroll').length, beforeNativeRestore);
  assert.equal(app.history.pushes.length, pushes);
  app.destroySmoothScroll();
});

test('destroy removes listeners, observers, temporary focus attributes and ticker; reinitialization works', () => {
  const app = setup();
  app.initializeSmoothScroll();
  app.click('/#contacto');
  app.current.complete();
  app.destroySmoothScroll();
  app.destroySmoothScroll();
  assert.equal(app.current.destroyed, true);
  assert.equal(app.tickers.size, 0);
  assert.equal(app.document.listenerCount(), 0);
  assert.equal(app.window.listenerCount(), 0);
  assert.equal(app.motion.listenerCount(), 0);
  assert.ok(app.observers.every((observer) => observer.disconnected));
  assert.equal(app.root.style.getPropertyValue('--anchor-offset'), '');
  assert.equal(app.elements.get('contacto').hasAttribute('tabindex'), false);
  assert.equal(app.elements.get('contacto').listenerCount(), 0);
  app.initializeSmoothScroll();
  assert.equal(app.instances.length, 2);
  assert.equal(app.tickers.size, 1);
  app.click('/#proyectos');
  assert.equal(app.trace.filter((entry) => entry.type === 'lenis-scroll' && entry.instance === app.current).length, 1);
  app.destroySmoothScroll();
});
