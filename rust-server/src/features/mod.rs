pub mod auth;
pub mod bets;
pub mod health;

use crate::{features::bets::routes::bets_router, state::AppState};
use axum::Router;

pub fn routes() -> Router<AppState> {
    Router::new()
        .merge(health::routes::health_router())
        .nest(
            "/api/auth",
            Router::new().merge(auth::routes::auth_router()),
        )
        .nest("/api/bets", bets_router())
}
