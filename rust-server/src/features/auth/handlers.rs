use crate::db::queries::{find_user_by_email, find_user_by_username};
use crate::features::auth::queries::register_user;
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
pub async fn create_user(
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

    if find_user_by_email(state.db()?, &cleaned_data.email)
        .await?
        .is_some()
    {
        return Err(AppError::conflict("Email already in use"));
    }

    if find_user_by_username(state.db()?, &cleaned_data.username)
        .await?
        .is_some()
    {
        return Err(AppError::conflict("Username already in use"));
    }

    register_user(
        state.db()?,
        &cleaned_data.email,
        &cleaned_data.username,
        &hashed_password,
    )
    .await?;

    // TODO: CREATE TOKEN FOR USER VERIFICATION
    // TODO: SEND VERIFICATION EMAIL WITH RESEND

    Ok(ApiResponse::created(
        "Check your email to validate your account.",
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
