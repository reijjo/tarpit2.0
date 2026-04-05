use axum::{
    body::to_bytes,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use rust_server::errors::AppError;
use serde_json::Value;

async fn read_response_body(response: Response) -> Value {
    let bytes = to_bytes(response.into_body(), usize::MAX)
        .await
        .expect("response body should be readable");

    serde_json::from_slice(&bytes).expect("response body should be valid json")
}

#[tokio::test]
async fn app_error_bad_request_maps_to_400_with_error_body() {
    let response = AppError::bad_request("Invalid input").into_response();
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = read_response_body(response).await;
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "Invalid input");
}

#[tokio::test]
async fn app_error_conflict_maps_to_409_with_error_body() {
    let response = AppError::conflict("Already exists").into_response();
    assert_eq!(response.status(), StatusCode::CONFLICT);

    let body = read_response_body(response).await;
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "Already exists");
}

#[tokio::test]
async fn app_error_database_maps_to_503_with_error_body() {
    let response = AppError::database("Database unavailable").into_response();
    assert_eq!(response.status(), StatusCode::SERVICE_UNAVAILABLE);

    let body = read_response_body(response).await;
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "Database unavailable");
}

#[tokio::test]
async fn app_error_sql_row_not_found_maps_to_404() {
    let response = AppError::from(sqlx::Error::RowNotFound).into_response();
    assert_eq!(response.status(), StatusCode::NOT_FOUND);

    let body = read_response_body(response).await;
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "Resource not found");
}
