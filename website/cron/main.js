import dotenv from "dotenv";
import nodeCron from "node-cron";

dotenv.config();

import { sendMail } from "./mailer-service.js";

const cronExpression = "0 * * * *";

async function main() {
  nodeCron.schedule(cronExpression, (now) => {
    if (typeof now === "object") {
      sendMail(now);
    }
  });
}

main();
