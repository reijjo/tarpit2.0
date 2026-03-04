use super::handlers::health_handler;
use crate::state::AppState;
use axum::{Router, routing::get};

pub fn health_router() -> Router<AppState> {
    Router::new().route("/health", get(health_handler))
}
