mod config;
mod middleware;
mod utils;

use axum::{Router, routing::get};
use tokio::net::TcpListener;

use crate::config::Config;
use crate::middleware::logger::log_middleware;
use crate::utils::tracing::init_tracing;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_tracing();

    let config = Config::from_env()
        .map_err(|e| std::io::Error::other(format!("Failed to load config from env: {e}")))?;

    let app = Router::new()
        .route("/", get(|| async { "Hello, world!" }))
        .layer(axum::middleware::from_fn(log_middleware));

    let addr = config.bind_addr();
    let listener = TcpListener::bind(&addr).await?;

    tracing::info!("Server on {addr}");

    axum::serve(listener, app).await?;

    Ok(())
}
