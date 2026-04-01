use super::handlers::register_user;
use crate::{
    features::auth::handlers::{check_availability, verify_account},
    state::AppState,
};
use axum::{
    Router,
    routing::{get, post},
};

pub fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(register_user))
        .route("/auth/available", get(check_availability))
        .route("/auth/verify", get(verify_account))
}
