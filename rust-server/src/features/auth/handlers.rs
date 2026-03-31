use crate::db::queries::{find_user_by_email, find_user_by_username};
use crate::features::auth::queries::delete_user;
use crate::features::auth::service::new_user;
use crate::state::AppState;
use crate::utils::api_response::ApiResponse;
use crate::utils::password::hash_password;
use crate::{errors::AppError, features::auth::types::RegisterData};
use axum::extract::rejection::JsonRejection;
use axum::extract::{Json, State};
use tokio::task::spawn_blocking;
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

    let hashed_password = spawn_blocking(move || hash_password(&cleaned_data.password))
        .await
        .map_err(|_| AppError::internal("Threading error"))??;

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
        tracing::error!("Failed to create user: {:#?}", email_err);
        delete_user(db, user_id).await?;
        return Err(email_err);
    }

    Ok(ApiResponse::created(
        "Check your email to validate your account",
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
