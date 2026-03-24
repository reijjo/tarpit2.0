use axum::{Json, http::StatusCode, response::IntoResponse};
use serde::Serialize;

pub enum ApiResponse<T: Serialize> {
    Ok(String, Option<T>),
    Created(String, Option<T>),
}

#[derive(Serialize)]
struct ResponseBody<T: Serialize> {
    success: bool,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

#[allow(dead_code)]
impl<T: Serialize> ApiResponse<T> {
    pub fn ok(message: impl Into<String>, data: Option<T>) -> Self {
        Self::Ok(message.into(), data)
    }

    pub fn created(message: impl Into<String>, data: Option<T>) -> Self {
        Self::Created(message.into(), data)
    }
}

impl<T: Serialize> IntoResponse for ApiResponse<T> {
    fn into_response(self) -> axum::response::Response {
        let (status, message, data) = match self {
            ApiResponse::Ok(message, data) => (StatusCode::OK, message, data),
            ApiResponse::Created(message, data) => (StatusCode::CREATED, message, data),
        };

        let body: ResponseBody<T> = ResponseBody {
            success: true,
            message,
            data,
        };
        (status, Json(body)).into_response()
    }
}
