pub mod auth;
pub mod health;

use crate::state::AppState;
use axum::Router;

pub fn routes() -> Router<AppState> {
    Router::new()
        .merge(health::routes::health_router())
        .nest("/api", Router::new().merge(auth::routes::auth_router()))
}
