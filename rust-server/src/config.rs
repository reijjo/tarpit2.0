use serde::Deserialize;
use std::fmt::Display;

#[derive(Debug, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum AppEnv {
    Development,
    Production,
    Test,
}

impl AppEnv {
    pub fn is_production(&self) -> bool {
        self == &AppEnv::Production
    }

    pub fn _is_test(&self) -> bool {
        self == &AppEnv::Test
    }
}

impl Display for AppEnv {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppEnv::Development => write!(f, "development"),
            AppEnv::Production => write!(f, "production"),
            AppEnv::Test => write!(f, "test"),
        }
    }
}

#[derive(Deserialize, Clone)]
pub struct Config {
    pub app_env: AppEnv,
    pub port: u16,
    pub _db_port: u16,
    pub _db_url: String,
    pub _db_name: String,
    pub _db_test_port: u16,
    pub _db_test_name: String,
    pub _db_test_url: String,
    pub _postgres_user: String,
    pub _postgres_password: String,
    pub _backend_url: String,
    pub frontend_url: String,
    pub _resend_api_key: String,
    pub _tarpit_domain: String,
}

impl Config {
    pub fn from_env() -> Result<Self, envy::Error> {
        dotenvy::dotenv().ok(); // Loads .env
        envy::from_env::<Self>() // Read all env vars, map names, parse types, return Config or Error
    }

    pub fn bind_addr(&self) -> String {
        if self.app_env.is_production() {
            format!("0.0.0.0:{}", self.port) // all interfaces in production
        } else {
            format!("127.0.0.1:{}", self.port) // localhost only in dev/test
        }
    }

    pub fn _active_db_url(&self) -> &str {
        if self.app_env._is_test() {
            &self._db_test_url
        } else {
            &self._db_url
        }
    }
}
