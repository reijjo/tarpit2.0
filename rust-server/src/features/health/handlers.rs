use crate::errors::AppError;
use crate::features::health::types::{DatabaseStatus, HealthResponse, HealthStatus, MemoryInfo};
use crate::state::AppState;
use axum::extract::State;
use chrono::Utc;
use sysinfo::System;

pub async fn health_handler(State(state): State<AppState>) -> Result<HealthResponse, AppError> {
    // 1. Calculate uptime using Instant (monotonic, never goes backward)
    let uptime = state.start_time.elapsed().as_secs_f64();

    // 2. Get ISO timestamp
    let timestamp = Utc::now().to_rfc3339();

    // 3. Collect memory info (with error handling)
    let memory = get_memory_info();

    // 4. Database status (hardcoded for now)
    let database = check_database_status(&state.db).await?;

    // 5. Determine overall status based on system health
    let status = determine_health_status(&memory, &database);

    Ok(HealthResponse {
        status,
        timestamp,
        uptime,
        environment: state.config.app_env.to_string(),
        memory,
        database: Some(database),
    })
}

fn determine_health_status(memory: &Option<MemoryInfo>, database: &DatabaseStatus) -> HealthStatus {
    // Check if memory collection failed
    if memory.is_none() {
        return HealthStatus::Error;
    }

    // Check if database connection failed
    match database.status {
        HealthStatus::Error => return HealthStatus::Error,
        _ => {}
    }

    // Check for memory issues
    if let Some(mem) = memory {
        if mem.percentage > 90.0 {
            return HealthStatus::NotGood;
        }
    }

    // Everything is healthy
    HealthStatus::Ok
}

fn get_memory_info() -> Option<MemoryInfo> {
    let mut sys = System::new_all();
    sys.refresh_memory();
    let used = sys.used_memory() as f64;
    let total = sys.total_memory() as f64;

    Some(MemoryInfo {
        used_mb: used / (1024.0 * 1024.0),
        total_mb: total / (1024.0 * 1024.0),
        percentage: if total > 0.0 {
            used / total * 100.0
        } else {
            0.0
        },
    })
}

async fn check_database_status(db: &sqlx::PgPool) -> Result<DatabaseStatus, AppError> {
    let start_time = std::time::Instant::now();

    match sqlx::query("SELECT 1").fetch_one(db).await {
        Ok(_) => {
            let latency = start_time.elapsed().as_secs_f64() * 1000.0;
            Ok(DatabaseStatus {
                status: HealthStatus::Ok,
                connection_test: "Database connection ok".to_string(),
                latency_ms: Some(latency),
            })
        }
        Err(err) => {
            tracing::error!(?err, "Database health check failed");
            Ok(DatabaseStatus {
                status: HealthStatus::Error,
                connection_test: format!("Database connection failed: {}", err),
                latency_ms: None, // ✅ No latency for failed connections
            })
        }
    }
}
