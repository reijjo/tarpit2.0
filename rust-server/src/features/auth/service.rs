use axum::http::{HeaderMap, header};
use sqlx::{PgPool, types::Uuid};
use tokio::task::spawn_blocking;

use crate::{
    config::Config,
    db::queries::{find_user_by_email, find_user_by_username},
    errors::AppError,
    features::auth::{
        queries::{create_user, create_verification_token},
        tokens::jwt::sign_access_token,
        types::LoginSessionResult,
    },
    types::User,
    utils::password,
};

// ----------------
// --- Register ---
// ----------------
pub async fn new_user(
    db: &PgPool,
    email: &str,
    username: &str,
    password: &str,
) -> Result<(Uuid, String), AppError> {
    let mut tx = db.begin().await.map_err(AppError::Sql)?;

    let user_id = create_user(&mut *tx, email, username, password).await?;

    let token = Uuid::new_v4().to_string();
    let expires_at = chrono::Utc::now() + chrono::Duration::hours(24);
    create_verification_token(&mut *tx, user_id, &token, expires_at).await?;

    tx.commit().await.map_err(AppError::Sql)?;

    Ok((user_id, token))
}

// -------------
// --- Login ---
// -------------
pub async fn find_login_user(login: &str, db: &PgPool) -> Result<User, AppError> {
    let user = if login.contains('@') {
        find_user_by_email(db, login).await?
    } else {
        find_user_by_username(db, login).await?
    }
    .ok_or_else(|| AppError::not_found("User not found"))?;

    Ok(user)
}

pub async fn login_and_create_session(
    db: &PgPool,
    config: &Config,
    login: &str,
    raw_password: &str,
) -> Result<LoginSessionResult, AppError> {
    let user = find_login_user(login, db).await?;

    let password_hash = user.password.clone();
    let password_input = raw_password.to_string();

    let password_valid =
        spawn_blocking(move || password::verify_password(&password_input, &password_hash))
            .await
            .map_err(|_| AppError::internal("Threading error"))?
            .map_err(|e| {
                tracing::error!(?e, "Password verification error");
                AppError::internal("Password verification failed")
            })?;

    if !password_valid {
        return Err(AppError::unauthorized("Invalid credentials"));
    }

    if !user.verified {
        return Err(AppError::forbidden("Account not verified"));
    }

    let role = user.role;
    let access_token = sign_access_token(config, user.id, role)?;

    Ok(LoginSessionResult {
        access_token,
        user_id: user.id,
        role,
    })
}

// ---------------------
// --- Authorization ---
// ---------------------
#[allow(dead_code)]
pub fn read_bearer(headers: &HeaderMap) -> Result<&str, AppError> {
    let raw = headers
        .get(header::AUTHORIZATION)
        .ok_or_else(|| AppError::unauthorized("Missing Authorization header"))?
        .to_str()
        .map_err(|_| AppError::unauthorized("Invalid Authrozation header"))?;

    raw.strip_prefix("Bearer ")
        .ok_or_else(|| AppError::unauthorized("Expected Bearer token"))
}
