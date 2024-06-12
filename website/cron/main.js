const nodeCron = require("node-cron");

require("dotenv").config();
const mailService = require("./mailer-service");

const cronExpression = "* * * * *";

async function main() {
  nodeCron.schedule(cronExpression, (now) => {
    if (typeof now === "object") {
      mailService.sendMail(now);
    }
  });
}

main();
