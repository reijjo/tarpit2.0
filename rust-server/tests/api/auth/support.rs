pub use crate::common::{build_test_server, build_test_server_without_db};

use axum_test::TestResponse;
use rust_server::{
    config::Config,
    features::auth::{
        queries::{create_user, verify_user},
        tokens::cookies::ACCESS_COOKIE,
    },
    utils::password::hash_password,
};
use sqlx::PgPool;
use tokio::sync::OnceCell;
use uuid::Uuid;

static TEST_DB_POOL: OnceCell<PgPool> = OnceCell::const_new();

pub struct LoginFixture {
    pub user_id: Uuid,
    pub email: String,
    pub username: String,
    pub password: String,
}

pub fn unique_email() -> String {
    format!("test_{}@example.com", Uuid::new_v4().simple())
}

pub fn unique_username() -> String {
    let id = Uuid::new_v4().simple().to_string();
    format!("u{}", &id[..11])
}

pub fn valid_password() -> &'static str {
    "Test123!@#"
}

async fn test_db_pool() -> &'static PgPool {
    TEST_DB_POOL
        .get_or_init(|| async {
            let config = Config::from_env().expect("failed to load .env config for test");
            PgPool::connect(&config.db_test_url)
                .await
                .expect("failed to connect to test database")
        })
        .await
}

pub async fn create_login_fixture(verified: bool) -> LoginFixture {
    let db = test_db_pool().await;
    let email = unique_email();
    let username = unique_username();
    let password = valid_password().to_string();
    let password_hash = hash_password(&password).expect("failed to hash login fixture password");

    let user_id = create_user(db, &email, &username, &password_hash)
        .await
        .expect("failed to create login fixture user");

    if verified {
        verify_user(db, user_id)
            .await
            .expect("failed to verify login fixture user");
    }

    LoginFixture {
        user_id,
        email,
        username,
        password,
    }
}

pub fn assert_access_cookie(response: &TestResponse) {
    let cookie = response.cookie(ACCESS_COOKIE);

    assert_eq!(cookie.name(), ACCESS_COOKIE);
    assert!(!cookie.value().is_empty());
    assert_eq!(cookie.http_only(), Some(true));
    assert_eq!(cookie.path(), Some("/"));
}
