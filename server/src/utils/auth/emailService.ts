import { Resend } from "resend";

import { RESEND_API, TARPIT_DOMAIN, FRONTEND_URL } from "../config";

import { AppError } from "../AppError";

const resend = new Resend(RESEND_API);

const BRAND = {
  primary: "#132035",
  primaryMuted: "#2b5e9e",
  accent: "#f9dc5c",
  textLight: "#f3f6fc",
  textDark: "#132035",
  textMuted: "#4b5563",
  border: "#dbe4f3",
};

const buildVerificationEmail = (
  verifyUrl: string,
  appImageUrl: string,
): { html: string; text: string } => {
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.primary};font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background-color:${BRAND.primary};">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${BRAND.border};">
            <tr>
              <td align="center" style="padding:28px 24px;background:linear-gradient(145deg, ${BRAND.primary} 0%, ${BRAND.primaryMuted} 100%);">
                <img
                  src="${appImageUrl}"
                  alt="Tarpit app"
                  width="64"
                  height="64"
                  style="display:block;margin:0 auto 14px;border-radius:50%;border:2px solid ${BRAND.accent};background-color:${BRAND.textLight};object-fit:cover;"
                />
                <h1 style="margin:0;color:${BRAND.textLight};font-size:26px;line-height:1.2;">Welcome to Tarpit</h1>
                <p style="margin:10px 0 0;color:${BRAND.textLight};font-size:15px;line-height:1.5;">
                  Thanks for registering. You are one click away from using your account.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 12px;">
                <p style="margin:0 0 12px;color:${BRAND.textDark};font-size:16px;line-height:1.6;">
                  Please confirm your email address so we can activate your profile and keep your account secure.
                </p>
                <p style="margin:0;color:${BRAND.textMuted};font-size:14px;line-height:1.6;">
                  This link expires in 24 hours.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 24px 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" bgcolor="${BRAND.accent}" style="border-radius:8px;">
                      <a
                        href="${verifyUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:${BRAND.textDark};text-decoration:none;"
                      >
                        Verify email
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px;">
                <p style="margin:0 0 8px;color:${BRAND.textMuted};font-size:13px;line-height:1.6;">
                  If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:0;word-break:break-all;">
                  <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="color:${BRAND.primaryMuted};font-size:13px;line-height:1.6;text-decoration:underline;">
                    ${verifyUrl}
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;">
                <p style="margin:0;color:${BRAND.textMuted};font-size:13px;line-height:1.6;">
                  Thank you for joining Tarpit. See you inside.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  const text = [
    "Welcome to Tarpit",
    "",
    "Thank you for registering. Please verify your email to activate your account.",
    "This link expires in 24 hours.",
    "",
    `Verify your email: ${verifyUrl}`,
    "",
    "If the button in the email does not work, copy the link above into your browser.",
  ].join("\n");

  return { html, text };
};

export const confirmAccount = async (
  email: string,
  token: string,
): Promise<void> => {
  if (!FRONTEND_URL) {
    throw new AppError("FRONTEND_URL environment variable is not set", 500);
  }

  const baseUrl = FRONTEND_URL.replace(/\/+$/, "");
  const verifyUrl = `${baseUrl}/verify?token=${encodeURIComponent(token)}`;
  const appImageUrl =
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a3.png";
  const emailTemplate = buildVerificationEmail(verifyUrl, appImageUrl);

  const { error } = await resend.emails.send({
    from: `noreply@${TARPIT_DOMAIN}`,
    to: email,
    subject: "Welcome to Tarpit - verify your email",
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  if (error) {
    console.error("Email service error: ", error);
    throw new AppError("Failed to send verification email", 500);
  }
};
