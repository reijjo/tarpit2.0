use axum::{
    Json,
    extract::{Query, State, rejection::QueryRejection},
};
use sqlx::Row;
use uuid::Uuid;

use crate::db::queries::find_user_by_id;
use crate::features::auth::queries::update_verification_token;
use crate::features::auth::types::{ResendTokenData, VerifyQuery};
use crate::{db::queries::find_token_by_value, features::auth::queries::verify_user};
use crate::{errors::AppError, state::AppState, utils::api_response::ApiResponse};
use chrono::{DateTime, Utc};

// ----------------------
// /api/auth/verify - params: token
// GET
// Account verification
// ----------------------
pub async fn verify_account(
    State(state): State<AppState>,
    params: Result<Query<VerifyQuery>, QueryRejection>,
) -> Result<ApiResponse<()>, AppError> {
    let Query(params) = match params {
        Ok(q) => q,
        Err(_) => return Err(AppError::bad_request("Invalid or missing token!")),
    };

    let token = match params.token.as_slice() {
        [t] if !t.trim().is_empty() => t.trim().to_string(),
        _ => return Err(AppError::bad_request("Invalid or missing token!")),
    };

    let db = state.db()?;
    let row = find_token_by_value(db, &token)
        .await?
        .ok_or_else(|| AppError::not_found("Invalid token!"))?;

    let user_id: Uuid = row.get("user_id");
    let expires_at: DateTime<Utc> = row.get("expires_at");
    let is_verified: bool = row.get("verified");

    if is_verified {
        return Err(AppError::conflict("Account already verified."));
    }

    if Utc::now() > expires_at {
        return Err(AppError::gone("Token has expired."));
    }

    verify_user(db, user_id).await?;

    Ok(ApiResponse::ok("Email verified successfully.", None))
}

// ----------------------
// /api/auth/verify - body: { token }
// POST
// Update verification token (for resending verification email)
// ----------------------
pub async fn resend_token(
    State(state): State<AppState>,
    Json(body): Json<ResendTokenData>,
) -> Result<ApiResponse<()>, AppError> {
    let token = body.token.trim();
    if token.is_empty() {
        return Err(AppError::bad_request("Invalid token!"));
    }

    let db = state.db()?;
    let result = find_token_by_value(db, token)
        .await?
        .ok_or_else(|| AppError::not_found("Token not found!"))?;

    if result.get::<bool, _>("verified") {
        return Err(AppError::conflict("Account already verified."));
    }

    let user = find_user_by_id(db, result.get("user_id"))
        .await?
        .ok_or_else(|| AppError::not_found("User not found."))?;

    let new_token = update_verification_token(db, user.get("id")).await?;

    if !state.config.app_env.is_test()
        && let Err(email_err) = state
            .email
            .send_verification_email(user.get("email"), &new_token)
            .await
    {
        tracing::error!("Failed to send verification email: {:#?}", email_err);
        return Err(email_err);
    }

    Ok(ApiResponse::ok("Check your inbox.", None))
}
