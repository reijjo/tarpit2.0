pub mod health;

use crate::state::AppState;
use axum::Router;

pub fn routes() -> Router<AppState> {
    Router::new().merge(health::routes::health_router())
}
