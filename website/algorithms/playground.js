const fs = require("node:fs");
const { EventEmitter } = require("node:stream");

const { v4 } = require("uuid");

const url = "";
const url1 = "https://google.com";

console.log("uuid ", v4());

function downloadFile(url) {
  fetch(url)
    .then((response) => response.body)
    .then((rb) => {
      const reader = rb.getReader();

      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then(({ done, value }) => {
              // If there is no more data to read
              if (done) {
                console.log("done", done);
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // Check chunks by logging to the console
              console.log(done, value);
              push();
            });
          }

          push();
        },
      });
    })
    .then(
      (stream) => {
        return new Response(stream, {
          headers: { "Content-Type": "text/xml" },
        }).text();
      }
      // Respond with our stream
    )
    .then((result) => {
      // Do things with result
      fs.writeFile("./f1.xml", result, (err) => {
        if (err) {
          throw new Error(`error writing file: ${err}`);
        }
      });
    });
}

// downloadFile(url);

function flattenArray(array) {
  let flattened = [];
  for (let e of array) {
    if (typeof e === "number") {
      flattened.push(e);
      continue;
    }
    flattened = [...flattened, ...flattenArray(e)];
  }
  return flattened;
}

/**
 * @typedef File
 * @property {string} path
 * @property {string} content
 */

/**
 *
 * @param {File[]} files
 */
function buildFileTree(files) {
  return files.reduce((p, f) => {
    const pathParts = f.path.split("/");
    let subtree = p;
    pathParts.forEach((p, i) => {
      if (!subtree[p]) {
        subtree[p] = {};
      }
      if (i === pathParts.length - 1) {
        subtree[p] = f;
      }
      subtree = subtree[p];
    });
    return p;
  }, {});
}

const files = [
  { path: "src/app/(pages)/blog/page.tsx" },
  { path: "src/app/api/routes.js" },
  { path: "src/globals.css" },
  { path: "src/icon.jpg" },
  { path: "src/app/(pages)/blog/blogs.ts" },
  { path: "src/app/(pages)/moments-of-being/layout.tsx" },
];

const words = ["a", "b", "c", "d"];
let wordsArray = [];
let wordsArrayRef = wordsArray;
words.forEach((w) => {
  wordsArrayRef[0] = w;
  wordsArrayRef[1] = [];
  wordsArrayRef = wordsArrayRef[1];
});
console.log("wordsArray ", JSON.stringify(wordsArray));

buildFileTree(files);

const memoryCacheClient = new EventEmitter();

memoryCacheClient.on("connect", () => {
  console.log("connected");
});

memoryCacheClient.on("error", () => {
  console.error("error");
});

function connectClient() {
  setTimeout(() => {
    memoryCacheClient.emit("connect");
  }, 1000);
}

// connectClient();

/**
 *
 * @param {Function} fn
 * @param {number} timeout
 * @returns
 */
function debounce(fn, timeout) {
  let timeoutID = null;
  return function (...args) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}

// function log() {
//   console.log("arguments ", arguments);
//   console.log("args ", ...arguments);
// }

// const debouncedFn = debounce(log, 1000);

// debouncedFn("first");
// debouncedFn("second");
// debouncedFn("a", "b", { bat: "cat" }, [7, 7, 7]);

function reverseString(s) {
  let stack = [];
  for (let i = 0; i < s.length; i++) {
    stack.unshift(s[i]);
  }
  console.log("stack ", stack);
}

reverseString("CodingMoney");

async function getWP(url) {
  const res = await fetch(url);
  const json = await res.json();
  console.log("json ", json);
}
const blogComments = [
  { id: 1, respondsTo: 0 },
  { id: 2, respondsTo: 0 },
  { id: 3, respondsTo: 0 },
  { id: 4, respondsTo: 1 },
  { id: 5, respondsTo: 2 },
  { id: 6, respondsTo: 1 },
  { id: 7, respondsTo: 3 },
  { id: 8, respondsTo: 3 },
  { id: 9, respondsTo: 7 },
  { id: 10, respondsTo: 7 },
  { id: 11, respondsTo: 5 },
  { id: 12, respondsTo: 6 },
  { id: 13, respondsTo: 0 },
  { id: 14, respondsTo: 12 },
];

const blogGraph = { 0: { children: [] } };

blogComments.forEach((c) => {
  subgraph = blogGraph;
  if (!subgraph[c.id]) {
    subgraph[c.id] = {
      children: [],
    };
  }
  subgraph[c.respondsTo].children.push(c);
});

function exploreBlogGraph(v) {
  let seen = {};
  let lvl = v.respondsTo;
  blogGraph[v.id].children.forEach((v) => {
    if (!seen[v.id]) {
      console.log("lvl, v ", lvl, v.id);
      seen[v.id] = true;
      exploreBlogGraph(v);
    }
  });
}
const timeoutDelay = 1000;
const start = Date.now();
function controlSetTimeout() {
  setTimeout(() => {
    console.log("control", Date.now() - start);
    controlSetTimeout();
  }, timeoutDelay);
}

let nextId = 0;

function tryDriftless(id, opts) {
  const { atMs, fn, thresholdMs = 1, aggression = 1.1 } = opts;
  const delayMs = atMs - Date.now();
  const handle =
    delayMs > thresholdMs
      ? setTimeout(() => {
          tryDriftless.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }, delayMs / aggression)
      : setTimeout(() => {
          // Call the function using setTimeout to ensure asynchrony
          fn();
        }, 0);
}

function setDriftless(opts) {
  const id = nextId;
  nextId += 1;
  tryDriftless(id, opts);
  return id;
}

function setDriftlessInterval(fn, delayMs, ...params) {
  let id;
  const opts = {
    atMs: Date.now() + delayMs,
    fn(...args) {
      opts.atMs += delayMs;
      tryDriftless(id, opts);
      return fn.call(this, ...args, ...params);
    },
  };
  id = setDriftless(opts);
  return id;
}

function backoff(fn) {
  if (fn.__next - Date.now() > 1) {
    setTimeout(() => {
      backoff(fn);
    }, (fn.__next - Date.now()) / 1.1);
    return;
  }
  setTimeout(() => {
    fn();
  });
  attunedSetTimeout(1000, fn);
}

function attunedSetTimeout(delay, fn) {
  const start = Date.now();
  fn.__next = start + delay;
  const lapse = fn.__next - Date.now();
  if (lapse > 1) {
    setTimeout(() => {
      backoff(fn);
    }, lapse / 1.1);
  }
}

attunedSetTimeout(1000, () => {
  console.log("attuned ", Date.now() - start);
});

setDriftlessInterval(() => {
  console.log("driftless ", Date.now() - start);
}, 1000);
controlSetTimeout();
