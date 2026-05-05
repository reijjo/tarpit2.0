use super::support::{
    assert_access_cookie, build_test_server, create_login_fixture, unique_email, valid_password,
};
use axum::http::StatusCode;
use serde_json::{Value, json};

#[tokio::test]
async fn login_success_with_email_sets_access_cookie_and_returns_user_data() {
    let server = build_test_server().await;
    let user = create_login_fixture(true).await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": format!("  {}  ", user.email.to_uppercase()),
            "password": user.password
        }))
        .await;

    res.assert_status(StatusCode::OK);
    assert_access_cookie(&res);

    let body: Value = res.json();
    assert_eq!(body["success"], true);
    assert_eq!(body["message"], "Welcome!");
    assert_eq!(body["data"]["user_id"], user.user_id.to_string());
    assert_eq!(body["data"]["role"], "GUEST");
}

#[tokio::test]
async fn login_success_with_username_sets_access_cookie_and_returns_user_data() {
    let server = build_test_server().await;
    let user = create_login_fixture(true).await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": format!("  {}  ", user.username.to_uppercase()),
            "password": user.password
        }))
        .await;

    res.assert_status(StatusCode::OK);
    assert_access_cookie(&res);

    let body: Value = res.json();
    assert_eq!(body["success"], true);
    assert_eq!(body["message"], "Welcome!");
    assert_eq!(body["data"]["user_id"], user.user_id.to_string());
    assert_eq!(body["data"]["role"], "GUEST");
}

#[tokio::test]
async fn login_wrong_password_returns_401() {
    let server = build_test_server().await;
    let user = create_login_fixture(true).await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": user.email,
            "password": "WrongPass123!"
        }))
        .await;

    res.assert_status(StatusCode::UNAUTHORIZED);

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "Invalid credentials");
}

#[tokio::test]
async fn login_unknown_user_returns_404() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": unique_email(),
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::NOT_FOUND);

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "User not found");
}

#[tokio::test]
async fn login_unverified_user_returns_403() {
    let server = build_test_server().await;
    let user = create_login_fixture(false).await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": user.username,
            "password": user.password
        }))
        .await;

    res.assert_status(StatusCode::FORBIDDEN);

    let body: Value = res.json();
    assert_eq!(body["success"], false);
    assert_eq!(body["error"], "Account not verified");
}

#[tokio::test]
async fn login_missing_login_returns_400() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn login_missing_password_returns_400() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": unique_email()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn login_empty_login_after_trim_returns_400() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": "   ",
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn login_empty_password_after_trim_returns_400() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": unique_email(),
            "password": "   "
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn login_invalid_login_too_short_returns_400() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": "ab",
            "password": valid_password()
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn login_invalid_password_too_short_returns_400() {
    let server = build_test_server().await;

    let res = server
        .post("/api/auth/login")
        .json(&json!({
            "login": unique_email(),
            "password": "Short1!"
        }))
        .await;

    res.assert_status(StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn login_rejects_malicious_login_values_without_server_errors() {
    let server = build_test_server().await;

    let cases = [
        "admin' OR 1=1 --",
        "<script>alert(1)</script>",
        "test@example.com%0d%0aBcc:attacker@example.com",
    ];

    for login in cases {
        let res = server
            .post("/api/auth/login")
            .json(&json!({
                "login": login,
                "password": valid_password()
            }))
            .await;

        res.assert_status(StatusCode::NOT_FOUND);

        let body: Value = res.json();
        assert_eq!(body["success"], false);
        assert_eq!(body["error"], "User not found");
    }
}

#[tokio::test]
async fn login_rejects_malicious_password_values_without_server_errors() {
    let server = build_test_server().await;
    let user = create_login_fixture(true).await;

    let cases = [
        "Password1!<script>alert(1)</script>",
        "Password1!' OR 1=1 --",
    ];

    for password in cases {
        let res = server
            .post("/api/auth/login")
            .json(&json!({
                "login": user.email,
                "password": password
            }))
            .await;

        res.assert_status(StatusCode::UNAUTHORIZED);

        let body: Value = res.json();
        assert_eq!(body["success"], false);
        assert_eq!(body["error"], "Invalid credentials");
    }
}
