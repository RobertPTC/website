const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const nodemailer = require("nodemailer");

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
  subject: "TEST",
  text: "MOB test :)",
};

const scheduledHour = 8;
const tz = "America/New_York";

/**
 *@function
 *@param {Date} now
 */
async function sendMail(now) {
  console.log("now ", dayjs(now).tz(tz).hour());
  // try {
  //   await transporter.sendMail(mailOptions);
  // } catch (e) {
  //   console.error(e);
  // }
}

module.exports = {
  sendMail,
};
