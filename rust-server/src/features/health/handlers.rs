use crate::features::health::types::{DatabaseStatus, HealthResponse, MemoryInfo};
use crate::state::AppState;
use axum::extract::State;
use chrono::Utc;
use sysinfo::System;

pub async fn health_handler(State(state): State<AppState>) -> HealthResponse {
    // 1. Calculate uptime using Instant (monotonic, never goes backward)
    let uptime = state.start_time.elapsed().as_secs_f64();

    // 2. Get ISO timestamp
    let timestamp = Utc::now().to_rfc3339();

    // 3. Collect memory info (with error handling)
    let memory = get_memory_info();

    // 4. Database status (hardcoded for now)
    let database = DatabaseStatus {
        status: "failed".to_string(),
        connection_test: "not implemented yet".to_string(),
    };

    // 5. Determine overall status based on system health
    let status = determine_health_status(&memory, &database);

    HealthResponse {
        status,
        timestamp,
        uptime,
        environment: state.config.app_env.to_string(),
        memory,
        database: Some(database),
    }
}

fn determine_health_status(memory: &Option<MemoryInfo>, database: &DatabaseStatus) -> String {
    // Check if memory collection failed
    if memory.is_none() {
        return "error".to_string();
    }

    // Check if database connection failed
    if database.status == "failed" {
        return "degraded".to_string();
    }

    // Everything is healthy
    "ok".to_string()
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
