use crate::features::auth::{jwt::sign_access_token, service::find_login_user, types::Token};
use axum::{
    Json,
    extract::{State, rejection::JsonRejection},
};

use crate::utils::password;
use tokio::task::spawn_blocking;
use validator::Validate;

use crate::features::auth::types::LoginData;

use crate::{errors::AppError, state::AppState, utils::api_response::ApiResponse};

// ----------------------
// /api/auth/login - body: { login, password }
// POST
// Log in
// ----------------------
pub async fn login_user(
    State(state): State<AppState>,
    payload: Result<Json<LoginData>, JsonRejection>,
) -> Result<ApiResponse<Token>, AppError> {
    let Json(payload) = match payload {
        Ok(json) => json,
        Err(rejection) => return Err(AppError::Json(rejection)),
    };

    let cleaned_data = validate_logindata(payload)?;
    let db = state.db()?;

    let user = find_login_user(&cleaned_data.login, db).await?;

    // Check the password
    let password_hash: String = user.password;
    let password_valid =
        spawn_blocking(move || password::verify_password(&cleaned_data.password, &password_hash))
            .await
            .map_err(|_| AppError::internal("Threading error"))?
            .map_err(|e| {
                tracing::error!(?e, "Password verification error");
                AppError::internal("Password verification failed")
            })?;
    if !password_valid {
        return Err(AppError::unauthorized("Invalid credentials"));
    }

    // Check if verified
    let is_verified: bool = user.verified;
    if !is_verified {
        return Err(AppError::forbidden("Account not verified"));
    }

    let token = sign_access_token(&state.config, user.id, "GUEST".to_string())?;

    Ok(ApiResponse::ok("Welcome!", Some(Token { token })))
}

// -----------------
// Validate data logindata
// -----------------
fn validate_logindata(input: LoginData) -> Result<LoginData, AppError> {
    let login = input.login.trim().to_lowercase();
    let password = input.password;

    if login.is_empty() || password.trim().is_empty() {
        return Err(AppError::bad_request("Missing fields."));
    }

    let cleaned = LoginData { login, password };
    cleaned.validate().map_err(AppError::Validation)?;
    Ok(cleaned)
}
