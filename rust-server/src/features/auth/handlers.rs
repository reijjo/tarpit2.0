use crate::db::queries::{
    find_token_by_value, find_user_by_email, find_user_by_id, find_user_by_username,
};
use crate::features::auth::queries::{delete_user, update_verification_token, verify_user};
use crate::features::auth::service::new_user;
use crate::features::auth::types::{AvailabilityQuery, ResendTokenData, VerifyQuery};
use crate::state::AppState;
use crate::utils::api_response::ApiResponse;
use crate::utils::password::hash_password;
use crate::{errors::AppError, features::auth::types::RegisterData};
use axum::extract::rejection::JsonRejection;
use axum::extract::{Json, Query, State};
use chrono::{DateTime, Utc};
use sqlx::Row;
use tokio::task::spawn_blocking;
use uuid::Uuid;
use validator::Validate;

// ----------------------
// /api/auth/register
// POST
// Create new user
// ----------------------
pub async fn register_user(
    State(state): State<AppState>,
    payload: Result<Json<RegisterData>, JsonRejection>,
) -> Result<ApiResponse<()>, AppError> {
    let Json(payload) = match payload {
        Ok(json) => json,
        Err(rejection) => return Err(AppError::Json(rejection)),
    };

    let cleaned_data = validate_registerdata(payload)?;
    let db = state.db()?;

    if find_user_by_email(db, &cleaned_data.email).await?.is_some() {
        return Err(AppError::conflict("Email already in use"));
    }

    if find_user_by_username(db, &cleaned_data.username)
        .await?
        .is_some()
    {
        return Err(AppError::conflict("Username already in use"));
    }

    let hashed_password = spawn_blocking(move || hash_password(&cleaned_data.password))
        .await
        .map_err(|_| AppError::internal("Threading error"))??;

    let (user_id, token) = new_user(
        db,
        &cleaned_data.email,
        &cleaned_data.username,
        &hashed_password,
    )
    .await?;

    // Send verification email - if it fails, delete user (compensating transaction)
    if !state.config.app_env.is_test()
        && let Err(email_err) = state
            .email
            .send_verification_email(&cleaned_data.email, &token)
            .await
    {
        // Compensating action: delete the user we just created
        tracing::error!("Failed to send verification email: {:#?}", email_err);
        if let Err(delete_err) = delete_user(db, user_id).await {
            tracing::error!(
                user_id = %user_id,
               ?delete_err,
                "Failed to delete user during compensation"
            );
        }
        return Err(email_err);
    }

    Ok(ApiResponse::created(
        "Check your email to validate your account",
        None,
    ))
}

// ----------------------
// /api/auth/available - params: email, username
// GET
// Check if email or username is available
// ----------------------
pub async fn check_availability(
    State(state): State<AppState>,
    Query(params): Query<AvailabilityQuery>,
) -> Result<ApiResponse<()>, AppError> {
    match (&params.email, &params.username) {
        (None, None) => return Err(AppError::bad_request("Invalid query")),
        (Some(_), Some(_)) => return Err(AppError::bad_request("Too many params")),
        _ => {}
    }

    let db = state.db()?;

    if let Some(email) = &params.email {
        let email = email.trim().to_lowercase();
        if email.is_empty() {
            return Err(AppError::bad_request("Invalid query"));
        }
        if find_user_by_email(db, &email).await?.is_some() {
            return Err(AppError::conflict("Email already in use"));
        }
    }

    if let Some(username) = &params.username {
        let username = username.trim().to_lowercase();
        if username.is_empty() {
            return Err(AppError::bad_request("Invalid query"));
        }
        if find_user_by_username(db, &username).await?.is_some() {
            return Err(AppError::conflict("Username already in use"));
        }
    }

    Ok(ApiResponse::ok("No duplicates found", None))
}

// ----------------------
// /api/auth/verify - params: token
// GET
// Account verification
// ----------------------
pub async fn verify_account(
    State(state): State<AppState>,
    Query(params): Query<VerifyQuery>,
) -> Result<ApiResponse<()>, AppError> {
    let token = match &params.token {
        Some(t) if !t.trim().is_empty() => t.trim().to_string(),
        _ => return Err(AppError::bad_request("Invalid or missing token")),
    };

    let db = state.db()?;
    let row = find_token_by_value(db, &token)
        .await?
        .ok_or_else(|| AppError::not_found("Invalid token"))?;

    let user_id: Uuid = row.get("user_id");
    let expires_at: DateTime<Utc> = row.get("expires_at");

    if Utc::now() > expires_at {
        return Err(AppError::gone("Token has expired"));
    }

    verify_user(db, user_id).await?;

    Ok(ApiResponse::ok("Email verified successfully", None))
}

// ----------------------
// /api/auth/verify
// POST
// Update verification token (for resending verification email)
// ----------------------
pub async fn resend_token(
    State(state): State<AppState>,
    Query(params): Query<ResendTokenData>,
) -> Result<ApiResponse<()>, AppError> {
    let token = &params.token;

    let db = state.db()?;
    let result = find_token_by_value(db, token)
        .await?
        .ok_or_else(|| AppError::not_found("Token not found"));

    let user = find_user_by_id(db, result?.get("user_id"))
        .await?
        .ok_or_else(|| AppError::not_found("User not found"))?;
    eprint!("RESULT: {:#?}", user);

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

    Ok(ApiResponse::ok(
        "Verification email resent. Check your inbox.",
        None,
    ))
}

// -----------------
// Validate data
// -----------------
fn validate_registerdata(input: RegisterData) -> Result<RegisterData, AppError> {
    let email = input.email.trim().to_lowercase();
    let username = input.username.trim().to_lowercase();
    let password = input.password;

    if email.is_empty() || username.is_empty() || password.trim().is_empty() {
        tracing::info!("MISSING FIELDS");
        return Err(AppError::bad_request("Missing fields."));
    }

    let cleaned = RegisterData {
        email,
        username,
        password,
    };
    cleaned.validate().map_err(AppError::Validation)?;

    Ok(cleaned)
}
