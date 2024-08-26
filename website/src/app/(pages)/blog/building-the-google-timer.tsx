"use client";
import { CodeBlock, a11yLight, a11yDark } from "react-code-blocks";

import { Box, Typography } from "@mui/material";

import { blogStyles } from "./blogs";
import useIsDarkMode from "./use-is-dark-mode";

export function BuildingTheGoogleTimer() {
  const isDarkMode = useIsDarkMode();
  return (
    <Box component="article">
      <Typography variant="h1" sx={{ fontSize: "4rem", mb: 4 }}>
        Building the Google Timer
      </Typography>
      <Box
        component="img"
        src="/timer.jpg"
        width="100%"
        sx={{ mb: 2 }}
        alt="Picture of timer application"
      />
      <Box component="article" id="motivation" sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ ...blogStyles.h2, mb: 1 }}>
          Motivation
        </Typography>
        <Typography>
          Time is an elusive beast, and as such must be tracked closely. Toward
          what ends does one spend the minutes of one&apos;s day? Perhaps you
          too have wondered where the day goes. To help us all out, I decided to
          crib the design of the delightful timer app Google provides on its
          search results page and extend it with some functionality to do just
          that: <Box component="i">track time over multiple projects</Box>. To
          build this &ldquo;improved&rdquo; timer application, I leveraged a few
          interesting technologies, namely, Web Workers and Local Storage.
        </Typography>
        <Typography>
          Concurrent with the question of how to track time is the question of
          how to show time that is tracked. To create a dashboard that would
          allow me to see easily how much time I have spent on which projects, I
          decided to use d3.js, which is a library with a bunch of helpful
          functions to shape data into information.
        </Typography>
      </Box>
      <Box component="article" id="webworkers" sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ ...blogStyles.h2, mb: 1 }}>
          Web Workers
        </Typography>
        <Typography>
          One might be tempted simply to handle the timer functionality with a
          call to <Box component="code">setTimeout</Box> in the browser, but
          that wouldn&apos;t work. What would work, however, is to use{" "}
          <Box component="code">setInterval</Box>, as that allows us to mark the
          ticks of the clock as they happen. Additionally, there is a big issue
          with the way the browser handles long-running JavaScript: It pauses
          its execution when the page&apos;s tab is inactive. Thus, you
          can&apos;t visit other web pages or use other apps while the timer is
          active, which is not very useful if you, like me, spend much of your
          day working on things while time passes, rather than literally
          watching time pass. We need a way to keep the process of the countdown
          going while we practive Spanish on Duolingo, or watch a video on
          YouTube, or write articles about building applications. Handily for
          us, there are Web Workers!
        </Typography>
        <Typography sx={{ mb: 2 }}>
          A Web Worker is a great solution to this problem because, to quote the
          documentation over at MDN, &ldquo;Web Workers are a simple means for
          web content to run scripts in background threads.&rdquo; A Web Worker
          will keep the interval alive even when the tab isn&apos;t focused.
          Furthermore, the Web Worker interface allows for two-way communication
          between itself and the tab that spawned it. Here are the steps to get
          this Web Worker up and running in a React component:
        </Typography>

        <Box>
          <Typography variant="h3" sx={{ ...blogStyles.h3, mb: 1 }}>
            Step 1: Create a Web Worker file
          </Typography>
          <Typography sx={{ mb: 1 }}>
            We will pass the path to this file to our Web Worker instance in our
            React component. Put this file in whichever directory the public
            assets for your website are served.
          </Typography>
          <CodeBlock
            customStyle={{
              backgroundColor: "var(--background-start-rgb)",
              fontFamily: "monospace",
              border: "1px solid",
              borderColor: "var(--foreground-rgb)",
              padding: "1rem",
              marginBottom: "16px",
            }}
            language="typescript"
            theme={isDarkMode ? a11yDark : a11yLight}
            showLineNumbers={false}
            text={`// @type {Object.<string, NodeJS.Timeout>}
let intentionIntervalIDs = {};

//@type {Object.<string, number>}
let intentionDurations = {};

// @function onMessage
// @param {MessageEvent<SetTimerDuration | StartTimer | StopTimer | ResetTimer>} e
function onMessage(e) {
  const {
    data: { action, packet },
  } = e;
   // handle message action
  switch (action) {
    case "setTimerDuration":
      intentionDurations[packet.intention] = packet.duration;
      break;
    case "startTimer":
      // create interval to invoke a callback every second; in the callback, decrement duration by one
      // and signal the tab thread via postMessage to update its duration state
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
self.onmessage = onMessage;`}
          />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ ...blogStyles.h3, mb: 1 }}>
            Step 2: Set up a Web Worker in a React Component
          </Typography>
          <Typography sx={{ mb: 1 }}>
            In your React component, you will need to set up a piece of state to
            hold a reference to the Web Worker instance, and an effect to load
            the script file.
          </Typography>
          <CodeBlock
            customStyle={{
              backgroundColor: "var(--background-start-rgb)",
              fontFamily: "monospace",
              border: "1px solid",
              borderColor: "var(--foreground-rgb)",
              padding: "1rem",
              marginBottom: "16px",
            }}
            language="typescript"
            theme={isDarkMode ? a11yDark : a11yLight}
            showLineNumbers={false}
            text={`// State to hold reference to Web Worker            
const [worker, setWorker] = useState(null);

useEffect(() => {
// Create a new Web Worker
const myWorker = new Worker('worker.js');

// Save the worker instance to state
setWorker(myWorker);

// Clean up the worker when the component unmounts
return () => {
  myWorker.terminate();
};
}, []); // Run this effect only once when the component mounts`}
          />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ ...blogStyles.h3, mb: 1 }}>
            Step 3: Listen for Events on the Web Worker
          </Typography>
          <Typography sx={{ mb: 1 }}>
            How you choose to attach listeners to your Web Worker instance will
            vary according to the implementation details of your app. In this
            case, because each timer handles its own duration, I attach a
            listener in each timer card component.
          </Typography>
          <CodeBlock
            customStyle={{
              backgroundColor: "var(--background-start-rgb)",
              fontFamily: "monospace",
              border: "1px solid",
              borderColor: "var(--foreground-rgb)",
              padding: "1rem",
              marginBottom: "8px",
            }}
            language="typescript"
            theme={isDarkMode ? a11yDark : a11yLight}
            showLineNumbers={false}
            text={`useEffect(() => {
    function onWorkerMessage(e: MessageEvent) {
    // When the timer card receives a message from the Web Worker, 
    // it checks to see if the intention in the data matches it's intention, and if it does, updates its duration state.
      if (e.data.intention === intention) {
        setActiveDuration(e.data.duration);
      }
    }
    worker.addEventListener("message", onWorkerMessage);
    return () => {
      worker.removeEventListener("message", onWorkerMessage);
    };
  }, [worker, intention]);`}
          />
        </Box>
        <Box>
          <Typography>
            So that&apos;s it for Web Worker! Three cheers for this versatile
            class. Although this example used a Dedicated worker (a worker only
            a single script utilizes), there are also Shared workers, which can
            be used in multiple scripts in different browser contexts.{" "}
          </Typography>
        </Box>
      </Box>

      <Box component="article" id="timeintervals">
        <Typography variant="h2" sx={{ ...blogStyles.h2, mb: 1 }}>
          Time Intervals
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Since a pomodoro duration could span multiple hours, and we want to
          break down how much time is spent per hour on a project, the need for
          an algorithm arose to handle this split. So, whenever an interval is
          recorded, first check if the interval fits within the current hour. If
          it does not, then break it up into smaller intervals that fill within
          the frame of an hour.
        </Typography>
        <CodeBlock
          customStyle={{
            backgroundColor: "var(--background-start-rgb)",
            fontFamily: "monospace",
            border: "1px solid",
            borderColor: "var(--foreground-rgb)",
            padding: "1rem",
            marginBottom: "16px",
          }}
          language="typescript"
          theme={isDarkMode ? a11yDark : a11yLight}
          showLineNumbers={false}
          text={`function determinePomodoroTimeSegments(
  seconds: number,
  startDate: Dayjs,
  intention: string
): PomodoroInput[] {
  const secondsToEndOfStartHour =
    60 * 60 - startDate.minute() * 60 - (60 - startDate.second());
  if (seconds <= secondsToEndOfStartHour) {
    return [
      {
        label: intention,
        seconds,
        id: uuid(),
        hour: startDate.hour(),
        month: startDate.month(),
        year: startDate.year(),
        date: startDate.date(),
      },
    ];
  }
  let date = startDate;
  let incrementedDate = startDate;
  let counter = 0;
  let p: PomodoroInput[] = [];
  while (seconds) {
    seconds -= 1;
    counter += 1;
    incrementedDate = incrementedDate.add(1, "second");
    if (incrementedDate.hour() !== date.hour()) {
      p = [
        ...p,
        {
          label: intention,
          seconds: counter,
          id: uuid(),
          hour: date.hour(),
          month: date.month(),
          year: date.year(),
          date: date.date(),
        },
      ];
      counter = 0;
      date = incrementedDate;
    }
  }
  p = [
    ...p,
    {
      label: intention,
      seconds: counter,
      id: uuid(),
      hour: date.hour(),
      month: date.month(),
      year: date.year(),
      date: date.date(),
    },
  ];
  return p;
}`}
        />
      </Box>
      <Box component="article" id="schematic" sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ ...blogStyles.h2, mb: 1 }}>
          A Schematic
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Here, you can see how a person might press a button in the browser to
          communicate the state of the timer (&ldquo;start&rdquo;,
          &ldquo;stop&rdquo;, or &ldquo;reset&rdquo;) and how long the timer
          should last. This state change handler is defined in the `onMessage`
          function. Additionally, within this method the timer is able to signal
          the browser at each tick of the timeout in order to update the UI; it
          does so by invoking the <Box component="code">postMessage</Box> method
          on the web worker instance; we refer to the instance via the keyword{" "}
          <Box component="code">self</Box>. Each timeout is held in the close
          embrace of an object in which the key is the &ldquo;intention&rdquo;
          of the timer and the value is the timeout ID. The trick here is to
          establish a new <Box component="code">setInterval</Box> every time the
          Start button is pressed.
        </Typography>
        <Box>
          {!isDarkMode && (
            <Box
              component="img"
              src="/pomodoro-schematic.svg"
              width="100%"
              alt="schematic of google timer"
            />
          )}
          {isDarkMode && (
            <Box
              component="img"
              src="/pomodoro-schematic-dark.svg"
              width="100%"
              alt="schematic of google timer"
            />
          )}
        </Box>
      </Box>
      <Box component="article" id="alert" sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ ...blogStyles.h2, mb: 1 }}>
          Alert
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Although I won&apos;t go into the Audio API, which is super fun, there
          is something worth noting that I learned while putting this project
          together: In Safari, audio sources must be loaded as a response to
          user interaction. So, I created a function to do that when a duration
          is submitted for a given intention:
        </Typography>
        <CodeBlock
          customStyle={{
            backgroundColor: "var(--background-start-rgb)",
            fontFamily: "monospace",
            border: "1px solid",
            borderColor: "var(--foreground-rgb)",
            padding: "1rem",
          }}
          language="typescript"
          theme={isDarkMode ? a11yDark : a11yLight}
          showLineNumbers={false}
          text={`function setAudioSource() {
  if (audioRef.current) {
    audioRef.current.src = "time-up.m4a";
  }
}`}
        />
      </Box>
      <Box component="article" id="datavisualization" sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ ...blogStyles.h2, mb: 1 }}>
          Data Visualization
        </Typography>
        <Typography>
          To give the data an informative and handsome form, I decided to use a
          stacked bar chart. This kind of chart will show the total number of
          minutes spent per project at whatever level of interval granularity is
          given. So far, I&apos;ve provided &ldquo;date&rdquo; and
          &ldquo;month&rdquo; options in the app.
        </Typography>
        <Typography sx={{ mb: 1 }}>
          As I mentioned in the motivation section, d3 is the library of choice
          to create the data dashboard. d3 on it&apos;s own provides a way to
          create elements in the DOM, but that fights against the render process
          of React; I&apos;ll demonstrate how to use React to handle rendering
          while letting d3 shine as a data transformer. NB I&apos;m assuming a
          level of familiarity with d3 such that you understand the concepts of
          domain and range, which are used to scale data points to the view.
        </Typography>
        <Box>
          <Typography variant="h3" sx={{ ...blogStyles.h3, mb: 1 }}>
            Step 1: Create the Data structure with d3
          </Typography>
          <Typography sx={{ mb: 1 }}>
            In this code block, we take our data, an array of Pomodoro objects
            which look like{" "}
            <Box component="code">
              {"{"}label: string, id: string, seconds: number{"}"}
            </Box>{" "}
            (label is the name of the timer). Then, we throw it up in the air
            with JS and it comes down with a nice array of objects we can map
            over in React to create our bar chart.
          </Typography>
          <CodeBlock
            customStyle={{
              backgroundColor: "var(--background-start-rgb)",
              fontFamily: "monospace",
              border: "1px solid",
              borderColor: "var(--foreground-rgb)",
              padding: "1rem",
              marginBottom: "16px",
            }}
            language="typescript"
            theme={isDarkMode ? a11yDark : a11yLight}
            showLineNumbers={false}
            text={`function makeBarsOutput(
  // PomodorosForDate is a map of date to Pomodoro, which is an object with properties id, seconds (length of interval), and intention
  pomodorosForDates: PomodorosForDate,
  allLabels: { [key: string]: string }
) {
  const mapFn = ([timeUnit, pomodoros]: [string, PomodorosForHour]) => {
    if (!pomodoros.length) return { timeUnit };
    // Helper function to add up all seconds associated with an intention
    const rects = rollup(pomodoros, timeUnit);
    // Index the data based on date and intention - this way d3 knows how to build the pieces of the stacked bar
    const dateIndex = index(
      rects,
      (r) => r.date,
      (r) => r.label
    );
    // Make a set of labels
    const labels = union(
      pomodorosForDates[timeUnit].map((d) => {
        allLabels[d.label] = d.label;
        return d.label;
      })
    );
    // d3 magic function that builds the pieces of the stacked bar
    const series = stack()
      .keys(labels)
      // @ts-ignore
      .value(([, group], key) => group.get(key).seconds)(dateIndex);
    const barHeight = series?.[series.length - 1]?.[0]?.[1];

    return {
      rects,
      dateIndex,
      series,
      barHeight,
      timeUnit,
    };
  };
  const bars = Object.entries(pomodorosForDates).map(mapFn);
  return { bars, allLabels: Object.keys(allLabels) };
}`}
          />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ ...blogStyles.h3, mb: 1 }}>
            Step 2: Render in React
          </Typography>
          <Typography sx={{ mb: 1 }}>
            The next step is pretty simple, but it does require some knowledge
            of SVG elements and how they are styled. Otherwise, there&apos;s
            nothing more than mapping over the objects we produced in the first
            step!
          </Typography>
          <CodeBlock
            customStyle={{
              backgroundColor: "var(--background-start-rgb)",
              fontFamily: "monospace",
              border: "1px solid",
              borderColor: "var(--foreground-rgb)",
              padding: "1rem",
            }}
            language="typescript"
            theme={isDarkMode ? a11yDark : a11yLight}
            showLineNumbers={false}
            text={`// imagine this map is contained in an SVG element 
{bars.bars.map((b, i) => {
  if (!b.barHeight) return <Box component="g" key={b.timeUnit} />;
  const { series, timeUnit } = b;
  const barHeight = series[series.length - 1][0][1];
  return (
    <Box
      component="g"
      key={timeUnit}
      transform={"translate(x(Number(timeUnit))}, 
        svgHeight - y(barHeight) - marginBottom
      })"}
    >
      {series.map((d, i) => {
        const element = d[0];
        return (
          <Tooltip
            key={d.key}
            title={
              <>
                {d.key} {renderActiveTimer(element[1] - element[0])}
              </>
            }
            placement="right"
            arrow
          >
            <Box
              component="rect"
              height={y(element[1]) - y(element[0])}px
              y={y(element[0])}
              width={bands.bandwidth()}
              id={d.key}
              fill={colorInterpolator(d.key) as string}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
})}`}
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="h2" sx={blogStyles.h2}>
          Conclusion
        </Typography>
        <Typography>
          And that wraps up this project! There are a few things I may improve
          later, but overall this was a very fun and interesting problem to
          solve!
        </Typography>
      </Box>
    </Box>
  );
}
