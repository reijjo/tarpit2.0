use axum::{
    extract::FromRequestParts,
    http::{header, request::Parts},
};
use uuid::Uuid;

use crate::{
    errors::AppError,
    features::auth::tokens::{cookies::ACCESS_COOKIE, jwt::verify_access_token},
    state::AppState,
};

#[derive(Debug)]
pub struct AuthUser {
    pub user_id: Uuid,
    pub role: String,
}

fn read_cookie_value(cookie_header: &str, target: &str) -> Option<String> {
    cookie_header.split(';').map(|p| p.trim()).find_map(|kv| {
        let (name, value) = kv.split_once('=')?;
        if name == target {
            Some(value.to_string())
        } else {
            None
        }
    })
}

impl FromRequestParts<AppState> for AuthUser {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let cookie_header = parts
            .headers
            .get(header::COOKIE)
            .ok_or_else(|| AppError::unauthorized("Missing cookie header"))?
            .to_str()
            .map_err(|_| AppError::unauthorized("Invalid cookie header"))?;

        let access_token = read_cookie_value(cookie_header, ACCESS_COOKIE)
            .ok_or_else(|| AppError::unauthorized("Missing access token cookie"))?;

        let claims = verify_access_token(&state.config, &access_token)?;

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
