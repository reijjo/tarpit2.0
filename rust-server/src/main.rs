mod app;
mod config;
mod db;
mod errors;
mod features;
mod middleware;
mod state;
mod utils;

use std::sync::Arc;
use std::time::Instant;
use tokio::net::TcpListener;

use crate::config::Config;
use crate::db::connect::init_db;
use crate::utils::tracing::init_tracing;

impl From<crate::db::connect::DbError> for StartupError {
    fn from(err: crate::db::connect::DbError) -> Self {
        match err {
            crate::db::connect::DbError::DbConnection => StartupError::DbConnect,
            crate::db::connect::DbError::DbMigration => StartupError::DbMigrate,
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
    let db = init_db(&config).await?;

    let state = state::AppState {
        config: Arc::clone(&config),
        start_time,
        db,
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

// async fn connect_db(config: &config::Config) -> Result<sqlx::PgPool, StartupError> {
//     // std::fs::create_dir_all("./migrations").map_err(|err| {
//     //     tracing::error!(?err, "Failed to create migrations directory");
//     //     StartupError::DbMigrate
//     // })?;

//     let url = config.active_db_url();

//     tracing::info!("Connecting to database...");

//     let pool = sqlx::postgres::PgPoolOptions::new()
//         .max_connections(20)
//         .min_connections(1)
//         .acquire_timeout(std::time::Duration::from_secs(5))
//         .idle_timeout(std::time::Duration::from_secs(600))
//         .connect(url)
//         .await
//         .map_err(|err| {
//             tracing::error!(?err, "Failed to connect to database");
//             StartupError::DbConnect
//         })?;

//     tracing::info!("Database connected");

//     // sqlx::migrate!("./migrations")
//     //     .run(&pool)
//     //     .await
//     //     .map_err(|err| {
//     //         tracing::error!(?err, "Failed to run migrations");
//     //         StartupError::DbMigrate
//     //     })?;

//     // tracing::info!("Migrations applied");

//     Ok(pool)
// }

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
