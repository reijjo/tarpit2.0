use sqlx::{PgPool, types::Uuid};

use crate::{
    db::queries::find_login_user_by_username,
    errors::AppError,
    features::auth::queries::{create_user, create_verification_token},
    types::User,
};

use crate::db::queries::find_login_user_by_email;

// ---------------------
// --- Register ---
// ---------------------
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

// ---------------------
// --- Login ---
// ---------------------
pub async fn find_login_user(login: &str, db: &PgPool) -> Result<User, AppError> {
    let user = if login.contains('@') {
        find_login_user_by_email(db, login).await?
    } else {
        find_login_user_by_username(db, login).await?
    }
    .ok_or_else(|| AppError::not_found("User not found"))?;

    Ok(user)
}
