mod app;
mod config;
mod features;
mod middleware;
mod state;
mod utils;

use std::sync::Arc;
use tokio::net::TcpListener;

use crate::config::Config;
use crate::utils::tracing::init_tracing;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_tracing();

    let config = Arc::new(
        Config::from_env()
            .map_err(|e| std::io::Error::other(format!("Failed to load config: {e}")))?,
    );
    let state = state::AppState {
        config: Arc::clone(&config),
    };

    let app = app::create_app(state);

    let addr = config.bind_addr();
    let listener = TcpListener::bind(&addr).await?;

    tracing::info!("⚙️  Environment: {}", config.app_env);
    tracing::info!("🚀 Server on {addr}");

    axum::serve(listener, app).await?;

    Ok(())
}
