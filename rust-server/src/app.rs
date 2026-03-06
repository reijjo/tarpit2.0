use crate::errors::AppError;
use crate::middleware::{cors::build_cors, logger::log_middleware};
use crate::state::AppState;
use axum::{Router, extract::OriginalUri};

pub fn create_app(state: AppState) -> Result<Router, String> {
    let cors_layer = build_cors(&state.config.frontend_url)?;

    Ok(crate::features::routes()
        .fallback(not_found)
        .layer(cors_layer)
        .layer(axum::middleware::from_fn(log_middleware))
        .with_state(state))
}

async fn not_found(uri: OriginalUri) -> AppError {
    AppError::not_found(format!("Nothing here {}", uri.0.path()))
}
