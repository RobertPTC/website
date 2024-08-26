import { MailtrapClient } from "mailtrap";

export default async function sendVerificationToken() {
  const token = process.env.MAILTRAP_API_TOKEN;
  const endpoint = "https://send.api.mailtrap.io/";

  return "";
}
