use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::types::UserRole;
use crate::utils::validators::{validate_email, validate_password, validate_username};

// ----------------
// --- Register ---
// ----------------
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

#[derive(Deserialize)]
pub struct AvailabilityQuery {
    pub email: Option<String>,
    pub username: Option<String>,
}

// --------------
// --- Verify ---
// --------------
#[derive(Deserialize)]
pub struct ResendTokenData {
    pub token: String,
}

#[derive(Deserialize)]
pub struct VerifyQuery {
    pub token: Option<String>,
}

// ------------
// --- Auth ---
// ------------

#[derive(Deserialize, Validate)]
pub struct LoginData {
    #[validate(length(
        min = 3,
        max = 255,
        message = "Login must be between 3 and 255 characters"
    ))]
    pub login: String,

    #[validate(length(
        min = 8,
        max = 50,
        message = "Password must be between 8 and 50 characters"
    ))]
    pub password: String,
}
#[derive(Serialize, Debug)]
pub struct MeResponse {
    pub id: String,
    pub email: String,
    pub username: String,
    pub role: UserRole,
}

#[derive(Serialize, Debug)]
#[allow(dead_code)]
pub struct Token {
    pub token: String,
}

#[derive(Serialize, Debug)]
pub struct LoginResponse {
    pub user_id: String,
    pub role: UserRole,
}

pub struct LoginSessionResult {
    pub access_token: String,
    pub user_id: Uuid,
    pub role: UserRole,
}
