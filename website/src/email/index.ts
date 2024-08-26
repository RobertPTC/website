import sendVerificationToken from "./sendVerificationToken";
export default interface EmailService {
  sendVerificationToken(
    email: string,
    verificationToken: string
  ): Promise<string | null>;
}

export const validEmailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailService: EmailService = {
  sendVerificationToken,
};
