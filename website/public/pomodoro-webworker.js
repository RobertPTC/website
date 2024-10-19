/**
 * @typedef {Object} SetTimerDurationPacket
 * @property {number} duration
 * @property {string} intention
 */

/**
 * @typedef {Object} SetTimerDuration
 * @property {"setTimerDuraction"} action
 * @property {SetTimerDurationPacket} packet
 */

/**
 * @typedef {Object} IntentionPacket
 * @property {string} intention
 */

/**
 * @typedef {Object} StopTimer
 * @property {"stopTimer"} action
 * @property {IntentionPacket} packet
 */

/**
 * @typedef {Object} StartTimer
 * @property {"startTimer"} action
 * @property {IntentionPacket} packet
 */

/**
 * @typedef {Object} ResetTimer
 * @property {"resetTimer"} action
 * @property {SetTimerDurationPacket} packet
 */

/**
 * @type {Object.<string, NodeJS.Timeout>}
 */
let intentionIntervalIDs = {};

/**
 * @type {Object.<string, number>}
 */
let intentionDurations = {};

const timeoutDelay = 1000;
/**
 *
 * @param {number} delay
 * @param {Function} fn
 */
function attunedSetTimeout(delay, fn) {
  const start = Date.now();
  const id = setTimeout(() => {
    const end = Date.now();
    const span = end - start;
    const newDelay = timeoutDelay * 2 - span;
    fn();
    attunedSetTimeout(newDelay, fn);
  }, delay);
}

/**
 *
 * @function onMessage
 * @param {MessageEvent<SetTimerDuration | StartTimer | StopTimer | ResetTimer>} e
 */

function onMessage(e) {
  const {
    data: { action, packet },
  } = e;
  switch (action) {
    case "setTimerDuration":
      intentionDurations[packet.intention] = packet.duration;
      break;
    case "startTimer":
      console.log("start ", Date.now());
      const intervalID = setInterval(() => {
        const nextDuration = intentionDurations[packet.intention] - 1;
        intentionDurations[packet.intention] = nextDuration;
        self.postMessage({
          intention: packet.intention,
          duration: nextDuration,
        });
        if (!nextDuration) {
          console.log("end ", Date.now());
          clearInterval(intentionIntervalIDs[packet.intention]);
        }
      }, 1000);
      intentionIntervalIDs[packet.intention] = intervalID;
      break;
    case "stopTimer":
      clearInterval(intentionIntervalIDs[packet.intention]);
      break;
    case "resetTimer":
      clearInterval(intentionIntervalIDs[packet.intention]);
      intentionDurations[packet.intention] = packet.duration;
      break;
  }
}
self.onmessage = onMessage;
