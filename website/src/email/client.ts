import { MailtrapClient } from "mailtrap";

let client: MailtrapClient | null = null;

export function getEmailClient() {
  const token = process.env.MAILTRAP_API_TOKEN;
  if (!client && token) {
    client = new MailtrapClient({ token });
  }
  return client;
}
