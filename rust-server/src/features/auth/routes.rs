use super::handlers::register_user;
use crate::{
    features::auth::handlers::{check_availability, resend_token, verify_account},
    state::AppState,
};
use axum::{
    Router,
    routing::{get, post},
};

pub fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/register", post(register_user))
        .route("/available", get(check_availability))
        .route("/verify", get(verify_account).post(resend_token))
}
