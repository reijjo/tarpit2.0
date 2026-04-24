use axum::{
    extract::FromRequestParts,
    http::{header, request::Parts},
};
use uuid::Uuid;

use crate::{errors::AppError, features::auth::jwt::verify_access_token, state::AppState};

#[derive(Debug)]
pub struct AuthUser {
    pub user_id: Uuid,
    pub role: String,
}

impl FromRequestParts<AppState> for AuthUser {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .ok_or_else(|| AppError::unauthorized("Missing Authorization header"))?
            .to_str()
            .map_err(|_| AppError::unauthorized("Expected Bearer token"))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or_else(|| AppError::unauthorized("Expected Bearer token"))?;

        let claims = verify_access_token(&state.config, token)?;

        Ok(AuthUser {
            user_id: claims.sub,
            role: claims.role,
        })
    }
}

#[allow(dead_code)]
pub fn require_role(auth: &AuthUser, allowed: &[&str]) -> Result<(), AppError> {
    if allowed.iter().any(|r| *r == auth.role) {
        Ok(())
    } else {
        Err(AppError::forbidden("Insufficient role"))
    }
}
