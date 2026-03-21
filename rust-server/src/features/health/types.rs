use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: HealthStatus,
    pub timestamp: String,
    pub uptime: f64,
    pub environment: String,
    pub memory: Option<MemoryInfo>,
    pub database: Option<DatabaseStatus>,
}

#[derive(Serialize)]
pub struct MemoryInfo {
    pub used_mb: f64,
    pub total_mb: f64,
    pub percentage: f64,
}

#[derive(Serialize)]
pub struct DatabaseStatus {
    pub status: HealthStatus,
    pub connection_test: String,
    pub latency_ms: Option<f64>,
}

impl axum::response::IntoResponse for HealthResponse {
    fn into_response(self) -> axum::response::Response {
        axum::Json(self).into_response()
    }
}

#[derive(Serialize)]
#[serde(rename_all = "lowercase")]
pub enum HealthStatus {
    Ok,
    NotGood,
    Error,
}
