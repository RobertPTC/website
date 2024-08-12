const fs = require("node:fs");

const url = "";
const url1 = "https://google.com";

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
        console.log("RESPONSE");
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
