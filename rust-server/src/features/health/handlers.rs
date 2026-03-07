use crate::features::health::types::{DatabaseStatus, HealthResponse, MemoryInfo};
use crate::state::AppState;
use axum::{extract::State, response::Json};
use chrono::Utc;
use std::time::SystemTime;
use sysinfo::System;

pub async fn health_handler(State(state): State<AppState>) -> Json<HealthResponse> {
    // 1. Calculate uptime
    let uptime = SystemTime::now()
        .duration_since(*state.start_time)
        .unwrap_or_default()
        .as_secs_f64();

    // 2. Get ISO timestamp
    let timestamp = Utc::now().to_rfc3339();

    // 3. Collect memory info (with error handling)
    let memory = get_memory_info();

    // 4. Database status (hardcoded for now)
    let database = DatabaseStatus {
        status: "failed".to_string(),
        connection_test: "not implemented yet".to_string(),
    };

    Json(HealthResponse {
        status: "ok".to_string(),
        timestamp,
        uptime,
        environment: state.config.app_env.to_string(),
        memory,
        database: Some(database),
    })
}

fn get_memory_info() -> Option<MemoryInfo> {
    let mut sys = System::new_all();
    sys.refresh_memory();

    Some(MemoryInfo {
        used_mb: sys.used_memory() as f64 / 1024.0,
        total_mb: sys.total_memory() as f64 / 1024.0,
        percentage: (sys.used_memory() as f64 / sys.total_memory() as f64) * 100.0,
    })
}
