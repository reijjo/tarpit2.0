use sqlx::{PgPool, Row, postgres::PgRow};
use uuid::Uuid;

use crate::errors::AppError;

pub async fn find_user_by_email(db: &PgPool, email: &str) -> Result<Option<PgRow>, AppError> {
    sqlx::query("SELECT id FROM users WHERE email = $1")
        .bind(email)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)
}

pub async fn find_user_by_username(db: &PgPool, username: &str) -> Result<Option<PgRow>, AppError> {
    sqlx::query("SELECT id FROM users WHERE username = $1")
        .bind(username)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)
}

#[allow(dead_code)]
pub async fn find_user_by_id(db: &PgPool, id: Uuid) -> Result<Option<PgRow>, AppError> {
    sqlx::query("SELECT id FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)
}

pub async fn find_token_by_value(db: &PgPool, token: &str) -> Result<Option<Uuid>, AppError> {
    let row = sqlx::query("SELECT user_id FROM tokens WHERE token = $1")
        .bind(token)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(row.map(|r| r.get("user_id")))
}
