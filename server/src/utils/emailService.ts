import { AppError } from "./AppError";
import { Resend } from "resend";

import { RESEND_API, TARPIT_DOMAIN } from "./config";

const resend = new Resend(RESEND_API);

export const confirmAccount = async (email: string): Promise<void> => {
  const { error } = await resend.emails.send({
    from: `noreply@${TARPIT_DOMAIN}`,
    to: email,
    subject: "Welcome to Tärpit!",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });

  if (error) {
    console.error("Email service error: ", error);
    throw new AppError(`Failed to send verification email`, 500);
  }
};
