use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;

#[derive(Debug)]
#[allow(dead_code)]
pub enum AppError {
    NotFound(String),
    Internal(String),
}

#[derive(Serialize)]
struct ErrorBody {
    success: bool,
    error: String,
}

#[allow(dead_code)]
impl AppError {
    pub fn not_found(message: impl Into<String>) -> Self {
        Self::NotFound(message.into())
    }

    pub fn internal(message: impl Into<String>) -> Self {
        Self::Internal(message.into())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound(message) => (StatusCode::NOT_FOUND, message),
            AppError::Internal(message) => (StatusCode::INTERNAL_SERVER_ERROR, message),
        };

        let body = ErrorBody {
            success: false,
            error: message,
        };
        (status, Json(body)).into_response()
    }
}
