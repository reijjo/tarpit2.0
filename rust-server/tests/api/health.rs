use super::common::build_test_server;
use serde_json::Value;

#[tokio::test]
async fn health_ok() {
    let server = build_test_server().await;

    let res = server.get("/health").await;
    res.assert_status_ok();

    // Parse the JSON response
    let body: Value = res.json();

    // Assert the response structure and values
    // Status should be "degraded" because database is failed
    assert_eq!(body["status"], "degraded");
    assert!(body["timestamp"].is_string());
    assert!(body["uptime"].is_number());
    assert!(body["environment"].is_string());

    // Check memory info structure
    let memory = &body["memory"];
    assert!(memory.is_object());
    assert!(memory["used_mb"].is_number());
    assert!(memory["total_mb"].is_number());
    assert!(memory["percentage"].is_number());

    // Check database status structure
    let database = &body["database"];
    assert!(database.is_object());
    assert_eq!(database["status"], "failed");
    assert_eq!(database["connection_test"], "not implemented yet");
}
