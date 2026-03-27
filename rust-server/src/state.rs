use crate::{config::Config, errors::AppError};
use std::time::Instant;

#[derive(Clone)]
pub struct AppState {
    pub config: std::sync::Arc<Config>,
    pub start_time: Instant,
    pub db: Option<sqlx::PgPool>,
}

impl AppState {
    pub fn db(&self) -> Result<&sqlx::PgPool, AppError> {
        self.db
            .as_ref()
            .ok_or_else(|| AppError::internal("No database"))
    }
}
