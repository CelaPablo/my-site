import Promise from 'bluebird';
import summaryText from 'raw-loader!./summary.txt';
import preStyles from 'raw-loader!./prestyles.css';

// Vars that will help us get er done
let speed = window.location.hostname === 'localhost' ? 16 : 32;
let skipEl, summaryEl;
let animationSkipped = false, done = false;

// Wait for load to get started.
document.addEventListener("DOMContentLoaded", function() {
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

async function surprisinglyShortAttentionSpan() {
  if (done) return;
  done = true;
  // There's a bit of a scroll problem with this thing
  let start = Date.now();
  while(Date.now() - 1000 > start) {
    workEl.scrollTop = Infinity;
    await Promise.delay(16);
  }
}

/** Helpers */
let endOfSentence = /[\.\?\!]\s$/;
let endOfBlock = /[^\/]\n\n$/;
let initCommand = /[\$]/;
let command = false, endBlock = false;

async function writeTo(el, message, index, interval, charsPerInterval) {
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

    if(initCommand.test(thisSlice)) command = true;
    if (endOfSentence.test(thisSlice)) thisInterval = interval * 20;
    if (endOfBlock.test(thisSlice)) {
      endBlock = true;
      thisInterval = interval * 10
    };
    if(command && endBlock) {
      command = false;
      endBlock = false;
      thisInterval = interval * 35;
    }

    await Promise.delay(thisInterval);

    return writeTo(el, message, index, interval, charsPerInterval);
  }
}

//
// Put els into the module scope.
//
function getEls() {
  // We're cheating a bit on styles.
  let preStyleEl = document.createElement('style');
  preStyleEl.textContent = preStyles;
  document.head.insertBefore(preStyleEl, document.getElementsByTagName('style')[0]);
  summaryEl = document.getElementById('summary-text');
  skipEl = document.getElementById('skip-animation');
}

//
// Create basic event handlers for user input.
//
function createEventHandlers() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      summaryEl.innerHTML = summaryText;
      summaryEl.scrollTop = summaryEl.scrollHeight;
      animationSkipped = true;
      skipEl.setAttribute('style', 'color:transparent;');
    }
  });
}

function writeSimpleChar(el, char) {
  el.innerHTML += char;
};
