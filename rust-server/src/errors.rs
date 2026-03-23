use std::collections::HashMap;

use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use validator::ValidationErrors;

use crate::db::connect::DbError;

#[derive(Debug)]
#[allow(dead_code)]
pub enum AppError {
    NotFound(String),
    Internal(String),
    Database(String),
    Validation(ValidationErrors),
}

#[derive(Serialize)]
struct ErrorBody {
    success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    errors: Option<HashMap<String, Vec<String>>>,
}

#[allow(dead_code)]
impl AppError {
    pub fn not_found(message: impl Into<String>) -> Self {
        Self::NotFound(message.into())
    }

    pub fn internal(message: impl Into<String>) -> Self {
        Self::Internal(message.into())
    }

    pub fn database(message: impl Into<String>) -> Self {
        Self::Database(message.into())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        match self {
            AppError::NotFound(msg) => (
                StatusCode::NOT_FOUND,
                Json(ErrorBody {
                    success: false,
                    error: Some(msg),
                    errors: None,
                }),
            )
                .into_response(),

            AppError::Internal(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorBody {
                    success: false,
                    error: Some(msg),
                    errors: None,
                }),
            )
                .into_response(),

            AppError::Database(msg) => (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(ErrorBody {
                    success: false,
                    error: Some(msg),
                    errors: None,
                }),
            )
                .into_response(),

            AppError::Validation(errs) => {
                let map = errs
                    .field_errors()
                    .iter()
                    .map(|(field, errors)| {
                        let messages = errors
                            .iter()
                            .filter_map(|e| e.message.as_ref().map(|m| m.to_string()))
                            .collect();
                        (field.to_string(), messages)
                    })
                    .collect();

                (
                    StatusCode::UNPROCESSABLE_ENTITY,
                    Json(ErrorBody {
                        success: false,
                        error: None,
                        errors: Some(map),
                    }),
                )
                    .into_response()
            }
        }
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
