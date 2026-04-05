use axum::{
    Json,
    extract::rejection::JsonRejection,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use validator::ValidationErrors;

use crate::db::connect::DbError;

#[derive(Debug)]
#[allow(dead_code)]
pub enum AppError {
    BadRequest(String),           // 400
    Json(JsonRejection),          // 400 with detailed JSON error
    Validation(ValidationErrors), // 400 with validation error details
    Unauthorized(String),         // 401
    Forbidden(String),            // 403
    NotFound(String),             // 404
    Sql(sqlx::Error), // 404 for RowNotFound, 409 for unique constraint violation, 500 for others
    Conflict(String), // 409
    Gone(String),     // 410
    TooManyRequests(String), // 429
    Internal(String), // 500
    Database(String), // 503
}

#[derive(Serialize)]
struct ErrorBody {
    success: bool,
    error: String,
}

#[allow(dead_code)]
impl AppError {
    // 400 Bad Request
    pub fn bad_request(message: impl Into<String>) -> Self {
        Self::BadRequest(message.into())
    }

    // 401 Unauthorized
    pub fn unauthorized(message: impl Into<String>) -> Self {
        Self::Unauthorized(message.into())
    }

    // 403 Forbidden
    pub fn forbidden(message: impl Into<String>) -> Self {
        Self::Forbidden(message.into())
    }

    // 404 Not Found
    pub fn not_found(message: impl Into<String>) -> Self {
        Self::NotFound(message.into())
    }

    // 409 Conflict
    pub fn conflict(message: impl Into<String>) -> Self {
        Self::Conflict(message.into())
    }

    // 410 Gone
    pub fn gone(message: impl Into<String>) -> Self {
        Self::Gone(message.into())
    }

    // 429 Too Many Requests
    pub fn too_many_requests(message: impl Into<String>) -> Self {
        Self::TooManyRequests(message.into())
    }

    // 500 Internal Server Error
    pub fn internal(message: impl Into<String>) -> Self {
        Self::Internal(message.into())
    }

    // 503 Service Unavailable (for database errors)
    pub fn database(message: impl Into<String>) -> Self {
        Self::Database(message.into())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound(message) => (StatusCode::NOT_FOUND, message),
            AppError::Unauthorized(message) => (StatusCode::UNAUTHORIZED, message),
            AppError::Internal(message) => (StatusCode::INTERNAL_SERVER_ERROR, message),
            AppError::Database(message) => (StatusCode::SERVICE_UNAVAILABLE, message),
            AppError::BadRequest(message) => (StatusCode::BAD_REQUEST, message),
            AppError::Gone(message) => (StatusCode::GONE, message),
            AppError::TooManyRequests(message) => (StatusCode::TOO_MANY_REQUESTS, message),
            AppError::Json(rejection) => {
                let message = match rejection {
                    JsonRejection::JsonDataError(e) => format!("Invalid JSON: {}", e),
                    JsonRejection::JsonSyntaxError(e) => format!("Invalid JSON syntax: {}", e),
                    JsonRejection::MissingJsonContentType(_) => {
                        "Content-Type must be application/json".to_string()
                    }
                    JsonRejection::BytesRejection(e) => {
                        format!("Failed to read request body: {}", e)
                    }
                    _ => "Invalid request body".to_string(),
                };
                (StatusCode::BAD_REQUEST, message)
            }
            AppError::Validation(errors) => (StatusCode::BAD_REQUEST, errors.to_string()),
            AppError::Sql(err) => match err {
                sqlx::Error::RowNotFound => {
                    (StatusCode::NOT_FOUND, "Resource not found".to_string())
                }
                sqlx::Error::Database(db_err) if db_err.code().as_deref() == Some("23505") => {
                    (StatusCode::CONFLICT, "Resource already exists".to_string())
                }
                _ => {
                    tracing::error!(?err, "Database query error");
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Shady SQL error: {}", err),
                    )
                }
            },
            AppError::Conflict(message) => (StatusCode::CONFLICT, message),
            AppError::Forbidden(message) => (StatusCode::FORBIDDEN, message),
        };

        let body = ErrorBody {
            success: false,
            error: message,
        };
        (status, Json(body)).into_response()
    }
}

impl From<DbError> for AppError {
    fn from(err: DbError) -> Self {
        match err {
            DbError::DbConnection(sql_err) => {
                AppError::Database(format!("Database connection failed: {}", sql_err))
            }
            DbError::DbMigration(migrate_err) => {
                AppError::Database(format!("Database migration failed: {}", migrate_err))
            }
        }
    }
}

impl From<JsonRejection> for AppError {
    fn from(err: JsonRejection) -> Self {
        AppError::Json(err)
    }
}

impl From<ValidationErrors> for AppError {
    fn from(err: ValidationErrors) -> Self {
        AppError::Validation(err)
    }
}

impl From<argon2::password_hash::Error> for AppError {
    fn from(err: argon2::password_hash::Error) -> Self {
        AppError::Internal(format!("Password hashing error: {}", err))
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        AppError::Sql(err)
    }
}
