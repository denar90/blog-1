import alerts from './alerts';
import * as analytics from './analytics';
import * as breakpoints from './breakpoints';
import contentLoader from './content-loader';
import drawer from './drawer';


const POLYFILL_PATH = '/assets/javascript/polyfills.js';


function main(err) {

  alerts.init();
  breakpoints.init();
  contentLoader.init();
  drawer.init();

  // Delays running any analytics or registering the service worker
  // to ensure the don't compete for load resources.
  window.onload = function() {
    // analytics.init();
    // analytics.trackPageload();
    // if (err) {
    //   analytics.trackError(err);
    // }
    // initPerformanceTracker();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
          .register('/sw.js')
          .catch(analytics.trackError);
    }
  };


  const twitterLink = document.querySelector('a[href="https://twitter.com/philwalton"]');

  twitterLink.addEventListener('click', (event) => {
    console.log(event.type);
    const data = {
      command: 'SEND_BEACON',
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel: `${event.currentTarget.href}`
    };
    navigator.serviceWorker.controller.postMessage(data);
    navigator.sendBeacon(`/message?${event.type}:${Date.now()}`, JSON.stringify(data));
    localStorage.setItem(`${Date.now()}:${event.type}`, JSON.stringify(data));
  });

  window.addEventListener('unload', (event) => {
    console.log(event.type);
    const data = {
      command: 'SEND_BEACON',
      eventCategory: 'Window',
      eventAction: 'unload',
      eventLabel: document.visibilityState
    };
    navigator.serviceWorker.controller.postMessage(data);
    navigator.sendBeacon(`/message?${event.type}:${Date.now()}`, JSON.stringify(data));
    localStorage.setItem(`${Date.now()}:${event.type}`, JSON.stringify(data));
  });

  document.addEventListener('visibilitychange', (event) => {
    console.log(event.type);
    const data = {
      command: 'SEND_BEACON',
      eventCategory: 'Page Visibility',
      eventAction: 'change',
      eventLabel: document.visibilityState
    };
    navigator.serviceWorker.controller.postMessage(data);
    navigator.sendBeacon(`/message?${event.type}:${Date.now()}`, JSON.stringify(data));
    localStorage.setItem(`${Date.now()}:${event.type}`, JSON.stringify(data));
  });

  window.addEventListener('beforeunload', (event) => {
    console.log(event.type);
    const data = {
      command: 'SEND_BEACON',
      eventCategory: 'Window',
      eventAction: 'beforeunload',
      eventLabel: document.visibilityState
    };
    navigator.serviceWorker.controller.postMessage(data);
    navigator.sendBeacon(`/message?${event.type}:${Date.now()}`, JSON.stringify(data));
    localStorage.setItem(`${Date.now()}:${event.type}`, JSON.stringify(data));
  });

}


function trackPerformance(entry) {
  console.log(entry);
  const duration = Math.round(entry.duration);

}


function initPerformanceTracker() {
  performance.getEntriesByType('measure').forEach(trackPerformance);

  var observer = new PerformanceObserver((observations) => {
    console.log('new observations...');
    observations.getEntries().forEach(trackPerformance);
  });
  observer.observe({entryTypes: ['measure']});
}


function browserSupportsAllFeatures() {
  return false && window.Promise && window.fetch && window.Symbol;
}


function loadScript(src, done) {
  const js = document.createElement('script');
  js.src = src;
  js.onload = function() {
    done();
  };
  js.onerror = function() {
    done(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}


if (browserSupportsAllFeatures()) {
  main();
} else {
  loadScript(POLYFILL_PATH, main);
}
