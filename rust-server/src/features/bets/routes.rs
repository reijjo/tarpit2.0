use axum::{Router, routing::post};

use crate::{features::bets::handlers::add_bet::add_bet, state::AppState};

pub fn bets_router() -> Router<AppState> {
    Router::new().route("/", post(add_bet))
}
