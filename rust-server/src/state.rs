use crate::config::Config;
use std::{sync::Arc, time::SystemTime};

#[derive(Clone)]
pub struct AppState {
    pub config: Arc<Config>,
    pub start_time: Arc<SystemTime>,
}
