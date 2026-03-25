use crate::state::AppState;
use crate::utils::api_response::ApiResponse;
use crate::{errors::AppError, features::auth::types::RegisterData};
use axum::extract::rejection::JsonRejection;
use axum::extract::{Json, State};
use validator::Validate;

// ----------------------
// /api/auth/register
// POST
// Create new user
// ----------------------
pub async fn create_user(
    State(_state): State<AppState>,
    payload: Result<Json<RegisterData>, JsonRejection>,
) -> Result<ApiResponse<RegisterData>, AppError> {
    let Json(payload) = match payload {
        Ok(json) => json,
        Err(rejection) => return Err(AppError::Json(rejection)),
    };

    let cleaned_data = validate_registerdata(payload)?;

    Ok(ApiResponse::created("User created!", Some(cleaned_data)))
}

fn validate_registerdata(input: RegisterData) -> Result<RegisterData, AppError> {
    let email = input.email.trim().to_lowercase();
    let username = input.username.trim().to_lowercase();
    let password = input.password.trim().to_string();

    if email.is_empty() || username.is_empty() || password.is_empty() {
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
