use sqlx::{PgPool, migrate, postgres::PgPoolOptions};
use std::time::Duration;

use crate::config::Config;

#[derive(Debug)]
pub enum DbError {
    DbConnection,
    DbMigration,
}

pub async fn init_db(config: &Config) -> Result<PgPool, DbError> {
    let pool = connect_db(config).await?;
    run_migrations(&pool).await?;
    Ok(pool)
}

async fn connect_db(config: &Config) -> Result<PgPool, DbError> {
    let url = &config.active_db_url();

    tracing::info!("Connecting to database...");

    let pool = PgPoolOptions::new()
        .max_connections(20)
        .min_connections(1)
        .acquire_timeout(Duration::from_secs(5))
        .idle_timeout(Duration::from_secs(600))
        .connect(url)
        .await
        .map_err(|err| {
            tracing::error!(?err, "Failed to connect to database");
            DbError::DbConnection
        })?;

    tracing::info!("Database connected");
    Ok(pool)
}

async fn run_migrations(pool: &PgPool) -> Result<(), DbError> {
    tracing::info!("Running migrations...");

    migrate!("./migrations").run(pool).await.map_err(|err| {
        tracing::error!(?err, "Failed to run migrations");
        DbError::DbMigration
    })?;

    tracing::info!("Migrations applied");

    Ok(())
}
