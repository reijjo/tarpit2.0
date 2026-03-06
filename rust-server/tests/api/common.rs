use std::sync::Arc;

use axum_test::TestServer;
use rust_server::{
    app::create_app,
    config::{AppEnv, Config},
    state::AppState,
};

pub fn build_test_server() -> TestServer {
    let mut config = Config::from_env().expect("failed to load .env config for test");

    // Integration tests should always run in explicit test mode,
    // regardless of local APP_ENV in .env.
    config.app_env = AppEnv::Test;
    config.db_url = config.db_test_url.clone();

    assert!(matches!(config.app_env, AppEnv::Test));
    eprintln!("[test] APP_ENV={}", config.app_env);

    let state = AppState {
        config: Arc::new(config),
    };

    let app = create_app(state).expect("app should build");
    TestServer::new(app)
}
