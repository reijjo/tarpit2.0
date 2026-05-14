use sqlx::{PgPool, postgres::PgRow};
use uuid::Uuid;

use crate::{errors::AppError, types::User};

// -----------------
// --- Find user ---
// -----------------
pub async fn find_user_by_email(db: &PgPool, email: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as::<_, User>(
        "SELECT id, email, username, password, verified, role, created_at, updated_at
         FROM users
         WHERE email = $1",
    )
    .bind(email)
    .fetch_optional(db)
    .await
    .map_err(AppError::Sql)
}

pub async fn find_user_by_username(db: &PgPool, username: &str) -> Result<Option<User>, AppError> {
    sqlx::query_as::<_, User>(
        "SELECT id, email, username, password, verified, role, created_at, updated_at
         FROM users
         WHERE username = $1",
    )
    .bind(username)
    .fetch_optional(db)
    .await
    .map_err(AppError::Sql)
}

pub async fn find_user_by_id(db: &PgPool, id: Uuid) -> Result<Option<PgRow>, AppError> {
    sqlx::query("SELECT id, email, username, role FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)
}

// -------------------------------
// --- Find verification token ---
// -------------------------------
pub async fn find_token_by_value(db: &PgPool, token: &str) -> Result<Option<PgRow>, AppError> {
    sqlx::query(
        "SELECT t.*, u.verified FROM tokens t
         JOIN users u ON t.user_id = u.id
         WHERE t.token = $1",
    )
    .bind(token)
    .fetch_optional(db)
    .await
    .map_err(AppError::Sql)
}
