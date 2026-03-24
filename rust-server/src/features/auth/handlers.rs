use crate::state::AppState;
use crate::utils::api_response::ApiResponse;
use crate::{errors::AppError, features::auth::types::RegisterData};
use axum::extract::rejection::JsonRejection;
use axum::extract::{Json, State};

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
    tracing::info!("Checking payload {:?}", payload);

    let RegisterData {
        email,
        username,
        password,
    } = payload;

    if email.is_empty() || username.is_empty() || password.is_empty() {
        tracing::info!("MISSING FIELDS");
        return Err(AppError::bad_request("Missing fields."));
    }
    Ok(ApiResponse::created(
        "User created!",
        Some(RegisterData {
            email,
            username,
            password,
        }),
    ))
}
