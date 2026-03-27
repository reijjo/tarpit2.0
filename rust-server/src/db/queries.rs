use sqlx::{PgPool, postgres::PgRow};

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
