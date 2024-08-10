const fs = require("node:fs");

const url =
  "https://file.notion.so/f/f/d0d5787b-ff93-48d4-bb8d-bffd9edc42e4/8c08a999-4b9e-44b8-bc17-bbaf8c219101/dunkin.xml?table=block&id=377557b0-66f2-45d7-a159-b2381391bfa2&spaceId=d0d5787b-ff93-48d4-bb8d-bffd9edc42e4&expirationTimestamp=1723392000000&signature=ezvRCNvl-KJiPFzjlUhtFjjsD8VYUUhONWpxbYA_RDE&downloadName=dunkin.xml";
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
    .then((stream) =>
      // Respond with our stream
      new Response(stream, { headers: { "Content-Type": "text/xml" } }).text()
    )
    .then((result) => {
      // Do things with result
      fs.writeFile("./f.xml", result, (err) => {
        if (err) {
          throw new Error(`error writing file: ${err}`);
        }
      });
    });
}

downloadFile(url);
