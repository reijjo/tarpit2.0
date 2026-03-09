use crate::config::Config;
use std::time::Instant;

#[allow(dead_code)]
#[derive(Clone)]
pub struct AppState {
    pub config: std::sync::Arc<Config>,
    pub start_time: Instant,
    pub db: sqlx::PgPool,
}
