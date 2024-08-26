import { MailtrapClient } from "mailtrap";

let client: MailtrapClient | null = null;

export function getEmailClientInstance() {
  const token = process.env.MAILTRAP_API_TOKEN;
  if (!client && token) {
    client = new MailtrapClient({ token });
  }
  return client;
}
