use crate::errors::AppError;

pub async fn send_verification_email(to_email: &str, token: &str) -> Result<(), AppError> {
    eprintln!("Sending verification email to: {to_email} with token: {token}");

    Ok(())
}
