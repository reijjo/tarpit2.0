use resend_rs::Resend;
use resend_rs::types::CreateEmailBaseOptions;

use crate::errors::AppError;
use crate::utils::email_templates::{build_verification_html, build_verification_text};

#[derive(Clone)]
pub struct EmailService {
    resend: Resend,
    frontend_url: String,
    from_email: String,
}

impl EmailService {
    pub fn new(resend: Resend, frontend_url: &str, tarpit_domain: &str) -> Self {
        Self {
            resend,
            frontend_url: frontend_url.to_string(),
            from_email: format!("noreply@{tarpit_domain}"),
        }
    }

    pub async fn send_verification_email(
        &self,
        to_email: &str,
        token: &str,
    ) -> Result<(), AppError> {
        let verify_url = format!(
            "{}/verify?token={}",
            self.frontend_url.trim_end_matches('/'),
            token
        );

        let html = build_verification_html(&verify_url);
        let text = build_verification_text(&verify_url);

        let email = CreateEmailBaseOptions::new(
            &self.from_email,
            [to_email],
            "Welcome to Tarpit - verify your email",
        )
        .with_html(&html)
        .with_text(&text);

        self.resend.emails.send(email).await.map_err(|e| {
            tracing::error!(?e, "Failed to send verification email");
            AppError::internal("Failed to send verification email")
        })?;

        tracing::info!(to = to_email, "Verification email sent");
        Ok(())
    }
}
