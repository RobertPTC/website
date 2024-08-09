const fs = require("node:fs");
const args = process.argv.slice(2);
const pathToFile = args[0];
fs.readFile(pathToFile, { encoding: "base64" }, (err, data) => {
  if (err) {
    throw new Error(`error reading file ${err}`);
  }
  fs.writeFile(
    "./base64encoded.txt",
    `data:image/jpg;base64,${data}`,
    (err) => {
      if (err) {
        throw new Error(`error writing base64 encoded image: ${err}`);
      }
    }
  );
});
