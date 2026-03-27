use sqlx::{PgPool, types::Uuid};

use crate::errors::AppError;

pub async fn register_user(
    db: &PgPool,
    email: &str,
    username: &str,
    password: &str,
) -> Result<Uuid, AppError> {
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
