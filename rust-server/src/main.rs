mod app;
mod config;
mod db;
mod errors;
mod features;
mod middleware;
mod state;
mod types;
mod utils;

use resend_rs::Resend;
use std::sync::Arc;
use std::time::Instant;
use tokio::net::TcpListener;

use crate::config::Config;
use crate::db::connect::DbError;
use crate::db::connect::init_db;
use crate::utils::email::EmailService;
use crate::utils::tracing::init_tracing;

impl From<DbError> for StartupError {
    fn from(err: DbError) -> Self {
        match err {
            DbError::DbConnection(_) => StartupError::DbConnect,
            DbError::DbMigration(_) => StartupError::DbMigrate,
        }
    }
}

#[derive(Debug)]
enum StartupError {
    ConfigLoad,
    AppBuild,
    Bind,
    Serve,
    DbConnect,
    DbMigrate,
}

#[tokio::main]
async fn main() -> Result<(), StartupError> {
    init_tracing();

    let config = Arc::new(Config::from_env().map_err(|err| {
        tracing::error!(?err, "Failed to load config from environment");
        StartupError::ConfigLoad
    })?);
    let start_time = Instant::now();
    let db = match init_db(&config).await {
        Ok(pool) => {
            tracing::info!("Database connected successfully");
            Some(pool)
        }
        Err(err) => {
            tracing::warn!(
                ?err,
                "Database connection failed, starting without database"
            );
            None
        }
    };

    let state = state::AppState {
        config: Arc::clone(&config),
        start_time,
        db,
        email: EmailService::new(
            Resend::new(&config.resend_api_key),
            &config.frontend_url,
            &config.tarpit_domain,
        ),
    };

    let app = app::create_app(state).map_err(|err| {
        tracing::error!(?err, "Failed to build app");
        StartupError::AppBuild
    })?;

    let addr = config.bind_addr();
    let listener = TcpListener::bind(&addr).await.map_err(|err| {
        tracing::error!(?err, %addr, "Failed to bind TCP listener");
        StartupError::Bind
    })?;

    tracing::info!("Environment: {}", config.app_env);
    tracing::info!("Server on {addr}");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .map_err(|err| {
            tracing::error!(?err, "Server runtime error");
            StartupError::Serve
        })?;

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        if let Err(err) = tokio::signal::ctrl_c().await {
            tracing::error!(?err, "Failed to listen for Ctrl+C");
        }
    };

    #[cfg(unix)]
    let terminate = async {
        use tokio::signal::unix::{SignalKind, signal};

        match signal(SignalKind::terminate()) {
            Ok(mut sigterm) => {
                let _ = sigterm.recv().await;
            }
            Err(err) => {
                tracing::error!(?err, "Failed to listen for SIGTERM");
            }
        }
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    tracing::info!("Shutdown signal received, stopping server gracefully");
}
