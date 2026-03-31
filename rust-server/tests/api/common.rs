use std::time::Instant;

use axum_test::TestServer;
use resend_rs::Resend;
use rust_server::{
    app::create_app,
    config::{AppEnv, Config},
    db::connect::init_db,
    state::AppState,
    utils::email::EmailService,
};

pub async fn build_test_server() -> TestServer {
    let mut config = Config::from_env().expect("failed to load .env config for test");
    let start_time = Instant::now();

    // Integration tests should always run in explicit test mode,
    // regardless of local APP_ENV in .env.
    config.app_env = AppEnv::Test;
    config.db_url = config.db_test_url.clone();

    assert!(matches!(config.app_env, AppEnv::Test));
    eprintln!("[test] APP_ENV={}", config.app_env);

    let db = init_db(&config)
        .await
        .expect("Failed to connect to test database");

    let config = std::sync::Arc::new(config);

    let state = AppState {
        config: std::sync::Arc::clone(&config),
        start_time,
        db: Some(db),
        email: EmailService::new(
            Resend::new(&config.resend_api_key),
            &config.frontend_url,
            &config.tarpit_domain,
        ),
    };

    let app = create_app(state).expect("app should build");
    TestServer::new(app)
}

pub async fn build_test_server_without_db() -> TestServer {
    let mut config = Config::from_env().expect("failed to load .env config for test");
    let start_time = Instant::now();

    // Integration tests should always run in explicit test mode,
    // regardless of local APP_ENV in .env.
    config.app_env = AppEnv::Test;
    config.db_url = config.db_test_url.clone();

    assert!(matches!(config.app_env, AppEnv::Test));
    eprintln!("[test] APP_ENV={}", config.app_env);

    let config = std::sync::Arc::new(config);

    // Don't connect to database - simulate database failure
    let state = AppState {
        config: std::sync::Arc::clone(&config),
        start_time,
        db: None, // No database connection
        email: EmailService::new(
            Resend::new(&config.resend_api_key),
            &config.frontend_url,
            &config.tarpit_domain,
        ),
    };

    let app = create_app(state).expect("app should build");
    TestServer::new(app)
}
