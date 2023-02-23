const summaryText = `
$> whoami

full name           Pablo Cela
email               celapablo9@gmail.com
location            Buenos Aires, Argentina
Age                 31
position            Blockchain Developer > Software Engineer
phone               (+54 9) 11-2401-4911


$> git commit -am "education"

high school         Juan XXIII (Systems Analyst)
university          UNLaM (Software Engineer)


$> ls -la summary

{{ Simplicity First }}

I can take any idea to its full implementation and final release.
Very proactive person, always looking forward to improve the team and myself.
Quick, passionate learner who successfully collaborated remotely to create excellent products.
Lately, I've been getting into bug bounties, securing contracts and DeFi developments.

Spanish             [##############################] 100.0%
English             [############################# ]  95.0%
C-Lang              [##############################] 100.0%

Solidity            [##############################] 100.0%
Teal                [##############################] 100.0%
JavaScript          [##############################] 100.0%
Python              [############################# ]  95.0%
React JS            [##############################] 100.0%
React Native        [############################  ]  90.0%
Ruby                [##############################] 100.0%


$> echo $WORK_EXPERIENCE

- ALLY             Smart Contracts Developer (jan 2021 - present)
  We are -buidling- DeFi protocols on the AVM.
  Ally is a protocol that takes care of committing and voting to Algorand's
  governance by dividing the TLV into Vaults to allow redemptions
  without losing rewards.

- Sonder           Ethereum Developer (jul 2019 - dec 2020)
  Created a gamified e-commerce platform for B2B interactions.
  Used the Ethereum blockchain to do escrow,
  to negotiate prices and to secure transactions.

- Ridges           Full Stack Developer (dec 2018 - may 2019)
  Developed an Android application that connected to a medical
  external device to operate it.
  The controlled device executed a cryolipolysis treatment on patients.

- Cien Radios       Junior developer (jun 2018 - dec 2018)
  Developed a -Spotify like- website and mobile app to stream music.
  They were build on React JS and React Native respectively.
  We used the Deezer API as the backend.

- Honky Tonk        Junior developer (oct 2016 - may 2018)
  Developed and maintained a small website for the store.


$> git show ethereum-tools

✓ OpenZeppelin contracts
✓ Remix IDE
✓ Hardhat
✓ Truffle
✓ Ganache
✓ Web3
✓ Ethers
✓ Infura
✓ Solc
✓ Teal
✓ Goal


$> _

`;


// Vars that will help us get er done
let speed = 8;
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
    await delay(16);
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

    await delay(thisInterval);

    return writeTo(el, message, index, interval, charsPerInterval);
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//
// Put els into the module scope.
//
function getEls() {
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
