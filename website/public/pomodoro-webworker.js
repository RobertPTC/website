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
 * @param {string} intention
 * @returns
 */
function backoff(delay, fn, intention) {
  const lapse = fn.__next - Date.now();
  if (lapse > 1) {
    const id = setTimeout(() => {
      backoff(delay, fn, intention);
    }, lapse / 1.1);
    intentionIntervalIDs[intention] = id;
    return;
  }
  const id = setTimeout(() => {
    attunedSetTimeout(delay, fn, intention);
    fn();
  });
  intentionIntervalIDs[intention] = id;
}
/**
 *
 * @param {number} delay
 * @param {Function} fn
 * @param {string} intention
 */
function attunedSetTimeout(delay, fn, intention) {
  if (!fn.__isInit) {
    fn.__next = Date.now() + delay;
    fn.__isInit = true;
  } else {
    fn.__next += delay;
  }
  backoff(delay, fn, intention);
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
      const timeoutCallback = () => {
        const nextDuration = intentionDurations[packet.intention] - 1;
        intentionDurations[packet.intention] = nextDuration;
        self.postMessage({
          intention: packet.intention,
          duration: nextDuration,
        });
        if (!nextDuration) {
          clearInterval(intentionIntervalIDs[packet.intention]);
        }
      };
      attunedSetTimeout(timeoutDelay, timeoutCallback, packet.intention);
      break;
    case "stopTimer":
      clearTimeout(intentionIntervalIDs[packet.intention]);
      break;
    case "resetTimer":
      clearTimeout(intentionIntervalIDs[packet.intention]);
      intentionDurations[packet.intention] = packet.duration;
      break;
  }
}
self.onmessage = onMessage;
