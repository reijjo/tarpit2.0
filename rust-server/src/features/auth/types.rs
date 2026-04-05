use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;
use validator::Validate;

use crate::utils::validators::{validate_email, validate_password, validate_username};

// -----------------------
// --- Register data ---
// -----------------------
#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct RegisterData {
    #[validate(length(max = 255, message = "Email must be at most 255 characters"), custom(function = validate_email))]
    pub email: String,

    #[validate(length(
        min = 3,
        max = 20,
        message = "Username must be between 3 and 20 characters"
    ), custom(function = validate_username))]
    pub username: String,

    #[validate(length(
        min = 8,
        max = 50,
        message = "Password must be between 8 and 50 characters"
    ), custom(function = validate_password))]
    pub password: String,
}

// -----------------------
// --- Login data ---
// -----------------------

#[derive(Deserialize, Validate)]
pub struct LoginData {
    #[validate(length(
        min = 3,
        max = 20,
        message = "Login must be between 3 and 20 characters"
    ))]
    pub login: String,

    #[validate(length(
        min = 8,
        max = 50,
        message = "Password must be between 8 and 50 characters"
    ))]
    pub password: String,
}

// -------------------------
// --- Resend token data ---
// -------------------------
#[derive(Deserialize)]
pub struct ResendTokenData {
    pub token: String,
}

// ------------------------
// --- Queries (params) ---
// ------------------------
#[derive(Deserialize)]
pub struct AvailabilityQuery {
    pub email: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize)]
pub struct VerifyQuery {
    pub token: Option<String>,
}

// -----------------------
// --- Token ---
// -----------------------
#[allow(dead_code)]
#[derive(Serialize, Debug)]
pub struct Token {
    pub token: String,
    pub expires_at: DateTime<Utc>,
    pub user_id: Uuid,
}
