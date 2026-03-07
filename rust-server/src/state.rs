use crate::config::Config;
use std::time::Instant;

#[derive(Clone)]
pub struct AppState {
    pub config: std::sync::Arc<Config>,
    pub start_time: Instant,
}
