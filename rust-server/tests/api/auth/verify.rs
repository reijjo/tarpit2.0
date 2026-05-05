use super::support::build_test_server;
use axum::http::StatusCode;
use serde_json::{Value, json};

#[tokio::test]
async fn verify_rejects_malicious_tokens_without_server_errors() {
    let server = build_test_server().await;

    let cases = [
        (
            "/api/auth/verify?token=%3Cscript%3Ealert(1)%3C%2Fscript%3E",
            StatusCode::NOT_FOUND,
            "Invalid token!",
        ),
        (
            "/api/auth/verify?token=admin%27%20OR%201%3D1%20--",
            StatusCode::NOT_FOUND,
            "Invalid token!",
        ),
        (
            "/api/auth/verify?token=test%40example.com%26admin%3Dtrue",
            StatusCode::NOT_FOUND,
            "Invalid token!",
        ),
    ];

    for (path, status, error) in cases {
        let res = server.get(path).await;

        res.assert_status(status);

        let body: Value = res.json();
        assert_eq!(body["success"], false);
        assert_eq!(body["error"], error);
    }
}

#[tokio::test]
async fn resend_rejects_malicious_tokens_without_server_errors() {
    let server = build_test_server().await;

    let cases = [
        "<script>alert(1)</script>",
        "admin' OR 1=1 --",
        "test@example.com&admin=true",
    ];

    for token in cases {
        let res = server
            .post("/api/auth/verify")
            .json(&json!({ "token": token }))
            .await;

        res.assert_status(StatusCode::NOT_FOUND);

        let body: Value = res.json();
        assert_eq!(body["success"], false);
        assert_eq!(body["error"], "Token not found!");
    }
}
