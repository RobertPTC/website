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

/**
 * Send a moment via email to a journalist
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
      const intervalID = setInterval(() => {
        const nextDuration = intentionDurations[packet.intention] - 1;
        intentionDurations[packet.intention] = nextDuration;
        self.postMessage({
          intention: packet.intention,
          duration: nextDuration,
        });
        if (!nextDuration) {
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
