#![allow(dead_code)]
use chrono::{DateTime, Utc};
use sqlx::{Executor, Postgres, types::Uuid};

use crate::errors::AppError;

// Create user - CREATE
pub async fn create_user<'e, E>(
    db: E,
    email: &str,
    username: &str,
    password: &str,
) -> Result<Uuid, AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    let row = sqlx::query_scalar::<_, Uuid>(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id",
    )
    .bind(email)
    .bind(username)
    .bind(password)
    .fetch_one(db)
    .await
    .map_err(AppError::Sql)?;

    Ok(row)
}

// Create verification token - CREATE
pub async fn create_verification_token<'e, E>(
    db: E,
    user_id: Uuid,
    token: &str,
    expires_at: DateTime<Utc>,
) -> Result<(), AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query("INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)")
        .bind(user_id)
        .bind(token)
        .bind(expires_at)
        .execute(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(())
}

// Delete user - DELETE (compensating transaction for failed email)
pub async fn delete_user<'e, E>(db: E, user_id: Uuid) -> Result<(), AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(user_id)
        .execute(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(())
}

// Verify account - UPDATE
pub async fn verify_user<'e, E>(db: E, user_id: Uuid) -> Result<(), AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query("UPDATE users SET verified = true WHERE id = $1")
        .bind(user_id)
        .execute(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(())
}

// Update token - UPDATE (for resending verification email)
pub async fn update_verification_token<'e, E>(db: E, user_id: Uuid) -> Result<String, AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    let new_token = Uuid::new_v4().to_string();
    let new_expires_at = Utc::now() + chrono::Duration::hours(24);

    sqlx::query("UPDATE tokens SET token = $1, expires_at = $2 WHERE user_id = $3")
        .bind(&new_token)
        .bind(new_expires_at)
        .bind(user_id)
        .execute(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(new_token)
}
