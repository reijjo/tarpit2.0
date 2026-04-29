use crate::features::auth::{
    service::login_and_create_session, tokens::cookies::access_cookie, types::LoginResponse,
};
use axum::{
    Json,
    extract::{State, rejection::JsonRejection},
};
use axum_extra::extract::CookieJar;

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
) -> Result<(CookieJar, ApiResponse<LoginResponse>), AppError> {
    let Json(payload) = match payload {
        Ok(json) => json,
        Err(rejection) => return Err(AppError::Json(rejection)),
    };

    let cleaned_data = validate_logindata(payload)?;
    let db = state.db()?;

    let session = login_and_create_session(
        db,
        &state.config,
        &cleaned_data.login,
        &cleaned_data.password,
    )
    .await?;

    let jar = CookieJar::new().add(access_cookie(&state.config, session.access_token));

    Ok((
        jar,
        ApiResponse::ok(
            "Welcome!",
            Some(LoginResponse {
                user_id: session.user_id.to_string(),
                role: session.role,
            }),
        ),
    ))
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
