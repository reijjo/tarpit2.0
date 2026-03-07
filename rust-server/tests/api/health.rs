use super::common::build_test_server;

#[tokio::test]
async fn health_ok() {
    let server = build_test_server();

    let res = server.get("/health").await;
    res.assert_status_ok();
    res.assert_text("OK");
}
