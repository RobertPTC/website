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
 * @typedef {Object} StartTimerPacket
 * @property {string} intention
 */

/**
 * @typedef {Object} StartTimer
 * @property {"startTimer"} action
 * @property {StartTimerPacket} packet
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
 * @param {MessageEvent<SetTimerDuration | StartTimer>} e
 */
function onMessage(e) {
  switch (e.data.action) {
    case "setTimerDuration":
      intentionDurations[e.data.packet.intention] = e.data.packet.duration;
      break;
    case "startTimer":
      const intervalID = setInterval(() => {
        const nextDuration = intentionDurations[e.data.packet.intention] - 1;
        console.log("nextDuration ", nextDuration);
        intentionDurations[e.data.packet.intention] = nextDuration;
        if (!nextDuration) {
          self.postMessage(`${e.data.packet.intention} complete`);
          clearInterval(intentionIntervalIDs[e.data.packet.intention]);
        }
      }, 1000);
      intentionIntervalIDs[e.data.packet.intention] = intervalID;
      break;
  }
}
self.onmessage = onMessage;
