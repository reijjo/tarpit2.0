use super::handlers::create_user;
use crate::state::AppState;
use axum::{Router, routing::post};

pub fn auth_router() -> Router<AppState> {
    Router::new().route("/auth/register", post(create_user))
}
