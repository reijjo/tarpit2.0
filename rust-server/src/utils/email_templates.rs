pub fn build_verification_html(verify_url: &str) -> String {
    format!(
        r##"<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#132035;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background-color:#132035;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe4f3;">
            <tr>
              <td align="center" style="padding:28px 24px;background-color:#132035;background:linear-gradient(145deg, #132035 0%, #2b5e9e 100%);">
                <span style="display:block;font-size:48px;margin-bottom:14px;">🎣</span>
                <h1 style="margin:0;color:#f3f6fc;font-size:26px;line-height:1.2;">Welcome to Tärpit</h1>
                <p style="margin:10px 0 0;color:#f3f6fc;font-size:15px;line-height:1.5;">Thanks for registering. You are one click away from using your account.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 12px;">
                <p style="margin:0 0 12px;color:#132035;font-size:16px;line-height:1.6;">Please confirm your email address so we can activate your profile and keep your account secure.</p>
                <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">This link expires in 24 hours.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 24px 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" bgcolor="#f9dc5c" style="border-radius:8px;">
                      <a href="{verify_url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#132035;text-decoration:none;">Verify email</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px;">
                <p style="margin:0 0 8px;color:#4b5563;font-size:13px;line-height:1.6;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0;word-break:break-all;">
                  <a href="{verify_url}" target="_blank" rel="noopener noreferrer" style="color:#2b5e9e;font-size:13px;line-height:1.6;text-decoration:underline;">{verify_url}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;">
                <p style="margin:0;color:#4b5563;font-size:13px;line-height:1.6;">Thank you for joining Tarpit. See you inside.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"##,
        verify_url = verify_url,
    )
}

pub fn build_verification_text(verify_url: &str) -> String {
    format!(
        "Welcome to Tarpit\n\n\
         Thank you for registering. Please verify your email to activate your account.\n\
         This link expires in 24 hours.\n\n\
         Verify your email: {verify_url}\n\n\
         If the button in the email does not work, copy the link above into your browser."
    )
}
