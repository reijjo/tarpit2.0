use std::ops::Deref;
use std::sync::OnceLock;
use std::sync::atomic::{AtomicUsize, Ordering};
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
use sqlx::PgPool;
use tokio::sync::OnceCell;

static TEST_DB_POOL: OnceCell<PgPool> = OnceCell::const_new();
static TEST_DB_RESET_ONCE: OnceCell<()> = OnceCell::const_new();
static ACTIVE_TEST_SERVERS: AtomicUsize = AtomicUsize::new(0);
static TEST_DB_URL: OnceLock<String> = OnceLock::new();
const TEST_DB_TRUNCATE_QUERY: &str =
    "TRUNCATE TABLE auth_sessions, tokens, users RESTART IDENTITY CASCADE";

pub struct TestServerHandle {
    server: TestServer,
    _db_guard: TestDbGuard,
}

struct TestDbGuard;

impl Drop for TestDbGuard {
    fn drop(&mut self) {
        if ACTIVE_TEST_SERVERS.fetch_sub(1, Ordering::AcqRel) != 1 {
            return;
        }

        let Some(db_url) = TEST_DB_URL.get().cloned() else {
            return;
        };

        let cleanup = std::thread::spawn(move || {
            let runtime = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build();
            let Ok(runtime) = runtime else {
                return;
            };

            runtime.block_on(async move {
                if let Ok(db) = sqlx::PgPool::connect(&db_url).await {
                    let _ = sqlx::query(TEST_DB_TRUNCATE_QUERY).execute(&db).await;
                }
            });
        });

        let _ = cleanup.join();
    }
}

impl Deref for TestServerHandle {
    type Target = TestServer;

    fn deref(&self) -> &Self::Target {
        &self.server
    }
}

impl TestServerHandle {
    fn new(server: TestServer) -> Self {
        ACTIVE_TEST_SERVERS.fetch_add(1, Ordering::AcqRel);
        Self {
            server,
            _db_guard: TestDbGuard,
        }
    }
}

pub async fn shared_test_db_pool() -> &'static PgPool {
    TEST_DB_POOL
        .get_or_init(|| async {
            let mut config = Config::from_env().expect("failed to load .env config for test");
            config.app_env = AppEnv::Test;
            config.db_url = config.db_test_url.clone();

            let _ = TEST_DB_URL.set(config.db_test_url.clone());

            init_db(&config)
                .await
                .expect("Failed to connect to test database")
        })
        .await
}

async fn reset_test_db_once() {
    TEST_DB_RESET_ONCE
        .get_or_init(|| async {
            let db = shared_test_db_pool().await;

            sqlx::query(TEST_DB_TRUNCATE_QUERY)
                .execute(db)
                .await
                .expect("Failed to reset test database tables");
        })
        .await;
}

pub async fn build_test_server() -> TestServerHandle {
    let mut config = Config::from_env().expect("failed to load .env config for test");
    let start_time = Instant::now();

    // Integration tests should always run in explicit test mode,
    // regardless of local APP_ENV in .env.
    config.app_env = AppEnv::Test;
    config.db_url = config.db_test_url.clone();

    assert!(matches!(config.app_env, AppEnv::Test));
    eprintln!("[test] APP_ENV={}", config.app_env);

    reset_test_db_once().await;

    let db = shared_test_db_pool().await.clone();

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
    TestServerHandle::new(TestServer::new(app))
}

pub async fn build_test_server_without_db() -> TestServerHandle {
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
    TestServerHandle::new(TestServer::new(app))
}
