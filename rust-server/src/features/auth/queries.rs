use sqlx::PgPool;

use crate::errors::AppError;

pub async fn register_user(
    db: &PgPool,
    email: &str,
    username: &str,
    password: &str,
) -> Result<(), AppError> {
    sqlx::query("INSERT INTO users (email, username, password) VALUES ($1, $2, $3)")
        .bind(email)
        .bind(username)
        .bind(password)
        .execute(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(())
}
