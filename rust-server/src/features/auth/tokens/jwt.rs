use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{config::Config, errors::AppError, types::UserRole};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AccessClaims {
    pub sub: Uuid,
    pub role: UserRole,
    pub exp: i64,
    pub iat: i64,
}

pub fn sign_access_token(
    config: &Config,
    user_id: Uuid,
    role: UserRole,
) -> Result<String, AppError> {
    let now = Utc::now();
    let exp = now + Duration::seconds(config.jwt_access_ttl_seconds);

    let claims = AccessClaims {
        sub: user_id,
        role,
        iat: now.timestamp(),
        exp: exp.timestamp(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_access_secret.as_bytes()),
    )
    .map_err(|_| AppError::internal("Failed to sign access token"))
}

pub fn verify_access_token(config: &Config, token: &str) -> Result<AccessClaims, AppError> {
    let decoded = decode::<AccessClaims>(
        token,
        &DecodingKey::from_secret(config.jwt_access_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| AppError::unauthorized("Invalid or expired token"))?;

    Ok(decoded.claims)
}
