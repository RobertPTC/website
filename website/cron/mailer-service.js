import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import nodemailer from "nodemailer";

import { getDB, getMoments } from "./db.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.APP_PASSWORD,
  },
});

const mailOptions = {
  from: {
    name: "Moments of Being",
    address: process.env.EMAIL_ADDRESS,
  },
  to: ["rptc3000@gmail.com"],
};

const scheduledHour = 8;
const tz = "America/New_York";
/**
 *
 * @param {import("./db").Moment} moment
 */
function createSubjectLine({ year, month, date }) {
  const timeFormat = Intl.DateTimeFormat("en", { month: "long" });
  return `On ${timeFormat.format(
    new Date(Number(year), Number(month))
  )} ${date}, ${year} you wrote...`;
}

/**
 * Send a moment via email to a journalist
 *@function sendMail
 *@param {Date} now
 */
export async function sendMail(now) {
  if (dayjs(now).tz(tz).hour() !== scheduledHour) {
    return;
  }
  const db = getDB();
  const moments = await getMoments(db, "rptc3000@gmail.com");
  if (!moments.length) {
    return;
  }
  const randomIndex = Math.floor(Math.random() * moments.length);
  const moment = moments[randomIndex];
  const options = {
    ...mailOptions,
    subject: `${createSubjectLine(moment)}`,
    html: `<div style="white-space: pre-wrap;">${moment.moment}</div>`,
    text: moment.moment,
  };
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.error(e);
  }
}
