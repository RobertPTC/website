import { getEmailClient } from "./client";

export default async function sendVerificationToken(
  email: string,
  verificationToken: string
) {
  const client = getEmailClient();
  if (client) {
    try {
      const res = await client.send({
        from: {
          email: "mailtrap@robertcunningham.app",
          name: "robertcunningham.app",
        },
        to: [{ email }],
        subject: "Mailtrap Test",
        text: `Your verification token: ${verificationToken}`,
      });
      return res.success;
    } catch (error) {
      console.log("error ", error);
    }
  }
  return null;
}
