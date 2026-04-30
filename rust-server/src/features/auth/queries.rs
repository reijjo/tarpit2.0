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

// Create auth session - CREATE
pub async fn create_auth_session<'e, E>(
    db: E,
    user_id: Uuid,
    refresh_token_hash: &str,
    expires_at: DateTime<Utc>,
    rotated_from_id: Option<Uuid>,
) -> Result<Uuid, AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    let id = sqlx::query_scalar::<_, Uuid>(
				"INSERT INTO auth_sessions (user_id, refresh_token_hash, expires_at, rotated_from_id) VALUES ($1, $2, $3, $4) RETURNING id",
		)
		.bind(user_id)
		.bind(refresh_token_hash)
		.bind(expires_at)
		.bind(rotated_from_id)
		.fetch_one(db)
		.await
		.map_err(AppError::Sql)?;

    Ok(id)
}

// Find auth session - READ
pub async fn find_auth_session_by_hash<'e, E>(
    db: E,
    refresh_token_hash: &str,
) -> Result<Option<(Uuid, Uuid, DateTime<Utc>, Option<DateTime<Utc>>)>, AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    let row = sqlx::query_as::<_, (Uuid, Uuid, DateTime<Utc>, Option<DateTime<Utc>>)>(
        "SELECT id, user_id, expires_at, revoked_at
         FROM auth_sessions
         WHERE refresh_token_hash = $1
         LIMIT 1",
    )
    .bind(refresh_token_hash)
    .fetch_optional(db)
    .await
    .map_err(AppError::Sql)?;

    Ok(row)
}

// Update auth session (revoke old, create new) - UPDATE
pub async fn revoke_auth_session<'e, E>(db: E, session_id: Uuid) -> Result<(), AppError>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query(
        "UPDATE auth_sessions
         SET revoked_at = now()
         WHERE id = $1 AND revoked_at IS NULL",
    )
    .bind(session_id)
    .execute(db)
    .await
    .map_err(AppError::Sql)?;

    Ok(())
}
