use axum::extract::State;
use sqlx::Row;

use crate::{
    db::queries::find_user_by_id, errors::AppError, features::auth::types::MeResponse,
    middleware::auth::AuthUser, state::AppState, utils::api_response::ApiResponse,
};

pub async fn me(
    State(state): State<AppState>,
    auth: AuthUser,
) -> Result<ApiResponse<MeResponse>, AppError> {
    let db = state.db()?;
    let row = find_user_by_id(db, auth.user_id)
        .await?
        .ok_or_else(|| AppError::unauthorized("User not found"))?;

    Ok(ApiResponse::ok(
        "Authenticated",
        Some(MeResponse {
            id: row.get::<uuid::Uuid, _>("id").to_string(),
            email: row.get("email"),
            username: row.get("username"),
            role: row.get("role"),
        }),
    ))
}
