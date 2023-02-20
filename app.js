import 'classlist-polyfill';
import Promise from 'bluebird';
import summaryText from 'raw-loader!./summary.txt';
import footerHTML from 'raw-loader!./footer.html';
let styleText = [0, 1].map((i) => require('raw-loader!./styles' + i + '.css').default);
import preStyles from 'raw-loader!./prestyles.css';
import { writeSimpleChar } from './lib/writeChar';
import getPrefix from './lib/getPrefix';

// Vars that will help us get er done
const isDev = window.location.hostname === 'localhost';
let speed = isDev ? 16 : 32;
let style, summaryEl;
let animationSkipped = false, done = false, paused = false;
let browserPrefix;

// Wait for load to get started.
document.addEventListener("DOMContentLoaded", function() {
  getBrowserPrefix();
  populateFooter();
  getEls();
  createEventHandlers();
  startAnimation();
});

async function startAnimation() {
  try {
    await surprisinglyShortAttentionSpan();
    await writeTo(summaryEl, summaryText, 0, speed, 1);
  }
  // Flow control straight from the ghettos of Milwaukee
  catch(e) {
    if (e.message === "SKIP IT") {
      surprisinglyShortAttentionSpan();
    } else {
      throw e;
    }
  }
}

// Skips all the animations.
async function surprisinglyShortAttentionSpan() {
  if (done) return;
  done = true;
  let txt = styleText.join('\n');

  // The work-text animations are rough
  // style.textContent = "#work-text * { " + browserPrefix + "transition: none; }";
  style.textContent += txt;

  // There's a bit of a scroll problem with this thing
  let start = Date.now();
  while(Date.now() - 1000 > start) {
    workEl.scrollTop = Infinity;
    await Promise.delay(16);
  }
}

/**
 * Helpers
 */

let endOfSentence = /[\.\?\!]\s$/;
let comma = /\D[\,]\s$/;
let endOfBlock = /[^\/]\n\n$/;

async function writeTo(el, message, index, interval, charsPerInterval){
  if (animationSkipped) {
    // Lol who needs proper flow control
    throw new Error('SKIP IT');
  }
  // Write a character or multiple characters to the buffer.
  let chars = message.slice(index, index + charsPerInterval);
  index += charsPerInterval;

  // Ensure we stay scrolled to the bottom.
  el.scrollTop = el.scrollHeight;
  writeSimpleChar(el, chars);

  // Schedule another write.
  if (index < message.length) {
    let thisInterval = (speed === interval) ? interval : speed;

    let thisSlice = message.slice(index - 2, index + 1);
    if (comma.test(thisSlice)) thisInterval = interval * 10;
    if (endOfBlock.test(thisSlice)) thisInterval = interval * 10;
    if (endOfSentence.test(thisSlice)) thisInterval = interval * 20;

    do {
      await Promise.delay(thisInterval);
    } while(paused);

    return writeTo(el, message, index, interval, charsPerInterval);
  }
}

//
// Older versions of major browsers (like Android) still use prefixes. So we figure out what that prefix is
// and use it.
//
function getBrowserPrefix() {
  // Ghetto per-browser prefixing
  browserPrefix = getPrefix(); // could be empty string, which is fine
  styleText = styleText.map(function(text) {
    return text.replace(/-webkit-/g, browserPrefix);
  });
}

//
// Put els into the module scope.
//
function getEls() {
  // We're cheating a bit on styles.
  let preStyleEl = document.createElement('style');
  preStyleEl.textContent = preStyles;
  document.head.insertBefore(preStyleEl, document.getElementsByTagName('style')[0]);

  // El refs
  style = document.getElementById('style-tag');
  summaryEl = document.getElementById('summary-text');
}

//
// Create links in footer.
//
function populateFooter() {
  let footer = document.getElementById('footer');
  footer.innerHTML = footerHTML;
}

//
// Create basic event handlers for user input.
//
function createEventHandlers() {
  // Skip anim on press esc
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      summaryEl.innerHTML = summaryText;
      summaryEl.scrollTop = summaryEl.scrollHeight;
      animationSkipped = true;
    }
  });
}
