use super::handlers::register_user;
use crate::state::AppState;
use axum::{Router, routing::post};

pub fn auth_router() -> Router<AppState> {
    Router::new().route("/auth/register", post(register_user))
}
