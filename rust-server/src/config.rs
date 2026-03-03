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
    // 🦀 Helper methods so handlers/config can ask questions cleanly
    // instead of doing string comparisons everywhere
    pub fn is_production(&self) -> bool {
        self == &AppEnv::Production
    }

    pub fn is_test(&self) -> bool {
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
    pub db_port: u16,
    pub db_url: String,
    pub db_name: String,
    pub db_test_port: u16,
    pub db_test_name: String,
    pub db_test_url: String,
    pub postgres_user: String,
    pub postgres_password: String,
    pub backend_url: String,
    pub frontend_url: String,
    pub resend_api_key: String,
    pub tarpit_domain: String,
}

impl Config {
    pub fn from_env() -> Result<Self, envy::Error> {
        dotenvy::dotenv().ok(); // Loads .env
        envy::from_env::<Self>() // Read all env vars, map names, parse types, return Config or Error
    }

    // 🦀 Derived value — the bind host is not a config input,
    // it's a decision based on environment. Logic belongs here, not in main.
    pub fn bind_addr(&self) -> String {
        if self.app_env.is_production() {
            format!("0.0.0.0:{}", self.port) // all interfaces in production
        } else {
            format!("127.0.0.1:{}", self.port) // localhost only in dev/test
        }
    }

    // 🦀 Which DB url to use — test env gets the test DB automatically
    pub fn active_db_url(&self) -> &str {
        if self.app_env.is_test() {
            &self.db_test_url
        } else {
            &self.db_url
        }
    }
}
