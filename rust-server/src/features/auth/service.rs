use sqlx::{PgPool, types::Uuid};

use crate::{
    errors::AppError,
    features::auth::queries::{create_user, create_verification_token},
};

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
