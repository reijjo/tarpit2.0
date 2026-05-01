use crate::features::auth::handlers::login::login_user;
use crate::features::auth::handlers::logout::logout_user;
use crate::features::auth::handlers::me::me;
use crate::features::auth::handlers::register::{check_availability, register_user};
use crate::features::auth::handlers::verify::{resend_token, verify_account};
use crate::state::AppState;
use axum::{
    Router,
    routing::{get, post},
};

pub fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/register", post(register_user))
        .route("/available", get(check_availability))
        .route("/verify", get(verify_account).post(resend_token))
        .route("/login", post(login_user))
        .route("/me", get(me))
        .route("/logout", post(logout_user))
}
