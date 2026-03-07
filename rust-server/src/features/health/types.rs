use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: String,
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
    pub status: String,
    pub connection_test: String,
}

impl axum::response::IntoResponse for HealthResponse {
    fn into_response(self) -> axum::response::Response {
        axum::Json(self).into_response()
    }
}
