import sendVerificationToken from "./sendVerificationToken";
export interface EmailService {
  sendVerificationToken(
    email: string,
    verificationToken: string
  ): Promise<string | null>;
}

const emailService: EmailService = {
  sendVerificationToken,
};
