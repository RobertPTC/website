import { Box, Typography } from "@mui/material";
import { blogStyles } from "./blogs";

export function BuildingTheGoogleTimer() {
  return (
    <Box component="article">
      <Typography variant="h1" sx={{ fontSize: "4rem" }}>
        Building the Google Timer
      </Typography>
      <Box component="section">
        <Typography variant="h2" sx={blogStyles.h2}>
          Motivation
        </Typography>
        <Typography variant="body1">
          Time is an elusive beast, and as such must be tracked closely. Toward
          what ends does one spend the minutes of one's day? Perhaps you too
          have wondered where the day goes. To help us all out, I decided to
          crib the design of the delightful timer app Google provides on its
          search results page and extend it with some functionality to do just
          that: <Box component="i">track time over multiple projects</Box>. To
          build this "improved" timer application, I leveraged a few interesting
          technologies, namely, Web Workers and Local Storage.
        </Typography>
        <Typography variant="body1">
          Concurrent with the question of how to track time is the question of
          how to show time that is tracked. To create a dashboard that would
          allow me to see easily how much time I have spent on which projects, I
          decided to use d3.js, which is a library with a bunch of helpful
          functions to shape data into information.
        </Typography>
      </Box>
      <Box component="section">
        <Typography variant="h2" sx={blogStyles.h2}>
          Web Workers
        </Typography>
        <Typography variant="body1">
          One might be tempted simply to handle the timer functionality with a
          call to <Box component="code">setTimeout</Box> in the browser, but
          that wouldn't work. What would work, however, is to use{" "}
          <Box component="code">setInterval</Box>, as that allows us to mark the
          ticks of the clock as they happen. Additionally, there is a big issue
          with the way the browser handles long-running JavaScript: It pauses
          its execution when the page's tab is inactive. Thus, you can't visit
          other web pages while the timer is active, which is not very useful if
          you, like me, spend much of your day working on things while time
          passes, rather than literally watching time pass. We need a way to
          keep the process of the countdown going while we practive Spanish on
          Duolingo, or watch a tape on YouTube, or write articles about building
          applications. Handily for us, there are Web Workers!
        </Typography>
        <Typography variant="body1">
          A Web Worker is a great solution to this problem because, to quote the
          documentation over at MDN, "Web Workers are a simple means for web
          content to run scripts in background threads." A Web Worker will keep
          the interval alive even when the tab isn't focused. Furthermore, the
          Web Worker interface allows for two-way communication between itself
          and the tab that spawned it. Here's the code to achieve said spawning
          in a React component:
        </Typography>
        <Box sx={{ p: 2 }}>
          <Box>
            <Box component="pre">
              <Box component="span" className="keyword">
                const{" "}
              </Box>
              <Box component="span">[worker, setWorker] = useState(null);</Box>
            </Box>
          </Box>
          <Box>
            <Box component="pre">
              <Box component="span">
                useEffect(() ={">"} {"{"}
                <Box component="pre">
                  <Box component="span" className="keyword tab">
                    const
                  </Box>
                </Box>
                )
              </Box>
            </Box>
          </Box>
        </Box>

        <Box component="pre">
          <Box component="code">
            {`/**
 * @type {Object.<string, NodeJS.Timeout>}
 */
let intentionIntervalIDs = {};

/**
 * @type {Object.<string, number>}
 */
let intentionDurations = {};

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
`}
          </Box>
        </Box>
        <Typography variant="body1">
          Here, you can see how a person might press a button in the browser to
          communicate the state of the timer ("start", "stop", or "reset") and
          how long the timer should last. This state change handler is defined
          in the `onMessage` function. Additionally, within this method the
          timer is able to signal the browser at each tick of the timeout in
          order to update the UI; it does so by invoking the{" "}
          <Box component="code">postMessage</Box> method on the web worker
          instance; we refer to the instance via the keyword{" "}
          <Box component="code">self</Box>. Each timeout is held in the close
          embrace of an object in which the key is the "intention" of the timer
          and the value is the timeout ID. The trick here is to establish a new{" "}
          <Box component="code">setInterval</Box> every time the Start button is
          pressed.
        </Typography>
        <Box component="section">
          <Typography variant="h2" sx={blogStyles.h2}>
            A Schematic
          </Typography>
          <Box component="img" src="/pomodoro-schematic.svg" />
        </Box>
        <Box component="article">Storage</Box>
        <Box component="article">Storage Algorithm</Box>
        <Box component="article">Alert</Box>
      </Box>
      <Box component="section">
        Data Visulization
        <Box component="article">d3</Box>
      </Box>
    </Box>
  );
}
